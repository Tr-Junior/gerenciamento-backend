
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/order-repository');
const entrance = require('../repositories/entrance-repository');
const product = require('../repositories/product-repository')
const guid = require('guid');
const authService = require('../services/auth-service');
const Product = require('../models/product');
const Order = require('../models/order');



exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.getSales = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query; // Obtém as datas do corpo da requisição
        const sales = await repository.getSalesByDateRange(startDate, endDate);
        res.status(200).send(sales);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

// exports.post = async (req, res, next) => {
//     try {
//         const token = req.body.token || req.query.token || req.headers['x-access-token'];
//         const data = await authService.decodeToken(token);
//         const number = guid.raw().substring(0, 6);

//         // Validação das formas de pagamento
//         let totalPayments = 0;
//         req.body.sale.payments.forEach(payment => {
//             totalPayments += payment.amount;
//         });

//         if (totalPayments !== req.body.sale.total) {
//             return res.status(400).send({
//                 message: 'A soma das formas de pagamento deve ser igual ao total da venda.'
//             });
//         }

//         await repository.create({
//             customer: data._id,
//             number: number,
//             client: req.body.client,
//             sale: {
//                 items: req.body.sale.items,
//                 discount: req.body.sale.discount,
//                 total: req.body.sale.total,
//                 payments: req.body.sale.payments // Recebe o array de pagamentos
//             }
//         });

//         await entrance.create({
//             numberOfOrder: number,
//             value: req.body.sale.total
//         });

//         req.body.sale.items.forEach(async (e) => {
//             const products = await product.getById(e.product);
//             product.update(products, {
//                 quantity: products.quantity - e.quantity,
//             });
//         });

//         res.status(201).send({
//             message: 'Venda efetuada com sucesso'
//         });
//     } catch (e) {
//         res.status(500).send({
//             message: 'Falha ao processar a requisição'
//         });
//     }
// };


exports.post = async (req, res, next) => {
    try {

        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        const data = await authService.decodeToken(token);
        const number = guid.raw().substring(0, 6);

        await repository.create({
            customer: data._id,
            number: number,
            client: req.body.client,
            sale: req.body.sale
            
        });

        await entrance.create(
            {
                numberOfOrder: number,
                value: req.body.sale.total
            }
        )

        req.body.sale.items.forEach(async (e) => {
            const products = await product.getById(e.product);
            product.update(products, {
                quantity: products.quantity = products.quantity - e.quantity,
            })
        });



        res.status(201).send({
            message: 'Venda efetuada com sucesso'
        });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
};


exports.delete = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('sale.items.product');

        if (!order) {
            return res.status(404).send({ message: 'Venda não encontrada' });
        }

        // Percorre os itens da venda e incrementa a quantidade no estoque
        for (const item of order.sale.items) {
            const productId = item.product.id;
            const quantity = + item.quantity;

            await Product.findByIdAndUpdate(productId, { $inc: { quantity: quantity } });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).send({
            message: 'Venda Deletada!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};

exports.deleteByCode = async (req, res, next) => {
    try {
        const order = await Order.findOne({ number: req.params.code }).populate('sale.items.product');

        if (!order) {
            return res.status(404).send({ message: 'Venda não encontrada' });
        }

        // Percorre os itens da venda e incrementa a quantidade no estoque
        for (const item of order.sale.items) {
            const productId = item.product.id;
            const quantity = item.quantity;

            await Product.findByIdAndUpdate(productId, { $inc: { quantity: quantity } });
        }

        await Order.findOneAndDelete({ number: req.params.code });

        res.status(200).send({
            message: 'Venda Deletada!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};
