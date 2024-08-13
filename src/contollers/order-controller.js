
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
        const data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter dados:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível obter os dados. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.getSales = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query; // Obtém as datas da query string
        const sales = await repository.getSalesByDateRange(startDate, endDate);
        res.status(200).send(sales);
    } catch (e) {
        console.error('Erro ao obter vendas por período:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível obter as vendas. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.post = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!token) {
            throw new Error('Token ausente');
        }

        const data = await authService.decodeToken(token);
        if (!data) {
            throw new Error('Token inválido');
        }

        const number = guid.raw().substring(0, 6);
        if (!number) {
            throw new Error('Falha ao gerar número do pedido');
        }

        try {
            await repository.create({
                customer: data._id,
                number: number,
                client: req.body.client,
                sale: req.body.sale
            });
        } catch (err) {
            console.error('Erro ao criar entrada no repositório:', err.message);
            throw new Error('Não foi possível salvar a venda. Por favor, tente novamente mais tarde.');
        }

        try {
            await entrance.create({
                numberOfOrder: number,
                value: req.body.sale.total
            });
        } catch (err) {
            console.error('Erro ao criar entrada na tabela de entradas:', err.message);
            throw new Error('Não foi possível registrar a entrada da venda. Por favor, tente novamente.');
        }

        for (const e of req.body.sale.items) {
            try {
                const products = await product.getById(e.product);
                if (!products) {
                    throw new Error(`Produto não encontrado: ${e.product}`);
                }

                await product.update(products._id, { 
                    quantity: products.quantity - e.quantity 
                });
            } catch (err) {
                console.error(`Erro ao atualizar o produto ${e.product}:`, err.message);
                throw new Error('Não foi possível atualizar o estoque do produto. Por favor, verifique os dados e tente novamente.');
            }
        }

        res.status(201).send({
            message: 'Venda efetuada com sucesso'
        });

        console.log('Corpo da requisição:', req.body);

    } catch (e) {
        console.error('Erro em exports.post:', e.message); // Log de erro mais detalhado
        res.status(500).send({
            message: 'Falha ao processar a requisição. Por favor, tente novamente mais tarde.' // Mensagem de erro mais amigável
        });
    }
};



exports.delete = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('sale.items.product');

        if (!order) {
            return res.status(404).send({ message: 'Venda não encontrada.' }); // Mensagem amigável para venda não encontrada
        }

        // Percorre os itens da venda e incrementa a quantidade no estoque
        for (const item of order.sale.items) {
            const productId = item.product.id;
            const quantity = +item.quantity;

            await Product.findByIdAndUpdate(productId, { $inc: { quantity: quantity } });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).send({
            message: 'Venda deletada com sucesso.' // Mensagem de sucesso
        });
    } catch (e) {
        console.error('Erro ao deletar venda:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível deletar a venda. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.deleteByCode = async (req, res, next) => {
    try {
        const order = await Order.findOne({ number: req.params.code }).populate('sale.items.product');

        if (!order) {
            return res.status(404).send({ message: 'Venda não encontrada.' }); // Mensagem amigável para venda não encontrada
        }

        // Percorre os itens da venda e incrementa a quantidade no estoque
        for (const item of order.sale.items) {
            const productId = item.product.id;
            const quantity = item.quantity;

            await Product.findByIdAndUpdate(productId, { $inc: { quantity: quantity } });
        }

        await Order.findOneAndDelete({ number: req.params.code });

        res.status(200).send({
            message: 'Venda deletada com sucesso.' // Mensagem de sucesso
        });
    } catch (e) {
        console.error('Erro ao deletar venda por código:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível deletar a venda. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};
