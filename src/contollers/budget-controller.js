
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/budget-repository');
const entrance = require('../repositories/entrance-repository');
const product = require('../repositories/product-repository')
const guid = require('guid');
const authService = require('../services/auth-service');
const Product = require('../models/product');
const Budget = require('../models/budget');


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



exports.post = async (req, res, next) => {
    try {
        const { client, budget, total } = req.body;

        // Verifica se já existe um orçamento com o mesmo nome do cliente
        let existingBudget = await Budget.findOne({ client });

        if (existingBudget) {
            // Itera sobre os novos itens do orçamento
            for (const newItem of budget.items) {
                // Verifica se o item já existe no orçamento com base no ID do produto
                const existingItemIndex = existingBudget.budget.items.findIndex(item => item.product.toString() === newItem.product.toString());

                if (existingItemIndex !== -1) {
                    // Se o item já existir, atualiza a quantidade
                    existingBudget.budget.items[existingItemIndex].quantity += newItem.quantity;
                } else {
                    // Se o item não existir, adiciona-o aos itens existentes
                    existingBudget.budget.items.push(newItem);
                }
            }

            // Atualiza o total do orçamento
            existingBudget.budget.total += budget.total;
            await existingBudget.save();

            return res.status(200).send({
                message: 'Orçamento atualizado com sucesso'
            });
        } else {
            // Cria um novo orçamento
            const number = guid.raw().substring(0, 6);

            await repository.create({
                client,
                number,
                budget,
                total
            });

            return res.status(201).send({
                message: 'Orçamento criado com sucesso'
            });
        }
    } catch (e) {
        console.error('Erro ao processar orçamento:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível processar o orçamento. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};



exports.delete = async (req, res, next) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).send({ message: 'Orçamento não encontrado.' }); // Mensagem amigável para orçamento não encontrado
        }

        await Budget.findByIdAndDelete(req.params.id);

        res.status(200).send({
            message: 'Orçamento deletado com sucesso.' // Mensagem de sucesso
        });
    } catch (e) {
        console.error('Erro ao deletar orçamento:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível deletar o orçamento. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


