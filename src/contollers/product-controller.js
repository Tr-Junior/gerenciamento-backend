'use strict';


const ValidationContract = require('../validators/validators');
const repository = require('../repositories/product-repository');
const guid = require('guid');



exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter dados:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível obter os dados. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.getBySlug = async (req, res, next) => {
    try {
        const data = await repository.getBySlug(req.params.slug);
        if (!data) {
            return res.status(404).send({ message: 'Registro não encontrado.' }); // Mensagem amigável caso o registro não exista
        }
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter registro por slug:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível obter o registro. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        if (!data) {
            return res.status(404).send({ message: 'Registro não encontrado.' }); // Mensagem amigável caso o registro não exista
        }
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter registro por ID:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível obter o registro. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.searchByTitle = async (req, res, next) => {
    try {
        const searchTerm = req.body.title; // Assumindo que o termo de pesquisa é enviado no corpo da requisição com o campo "title"
        if (!searchTerm) {
            return res.status(400).send({ message: 'O termo de pesquisa é obrigatório.' }); // Mensagem amigável para falta de termo de pesquisa
        }
        const data = await repository.getByTitle(searchTerm);
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao buscar registro por título:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível realizar a busca. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};



exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve ter pelo menos 3 caracteres.');
    contract.hasMinLen(req.body.quantity, 1, 'A quantidade deve ser informada.');
    contract.hasMinLen(req.body.min_quantity, 1, 'A quantidade mínima deve ser informada.');
    contract.hasMinLen(req.body.purchasePrice, 1, 'O preço de compra deve ser informado.');
    contract.hasMinLen(req.body.price, 1, 'O preço deve ser informado.');

    if (!contract.isValid()) {
        return res.status(400).send({ errors: contract.errors() }); // Envio dos erros de validação
    }

    try {
        await repository.create({
            codigo: guid.raw().substring(0, 6),
            title: req.body.title,
            quantity: req.body.quantity,
            min_quantity: req.body.min_quantity,
            purchasePrice: req.body.purchasePrice,
            price: req.body.price
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.error('Erro ao cadastrar produto:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível cadastrar o produto. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        const updated = await repository.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).send({ message: 'Produto não encontrado.' }); // Mensagem amigável caso o produto não exista
        }
        res.status(200).send({ message: 'Produto atualizado com sucesso!' });
    } catch (e) {
        console.error('Erro ao atualizar produto:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível atualizar o produto. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.updateByIdBody = async (req, res, next) => {
    try {
        const updated = await repository.update(req.body.id, req.body);
        if (!updated) {
            return res.status(404).send({ message: 'Produto não encontrado.' }); // Mensagem amigável caso o produto não exista
        }
        res.status(200).send({ message: 'Produto atualizado com sucesso!' });
    } catch (e) {
        console.error('Erro ao atualizar produto por corpo:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível atualizar o produto. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.delete = async (req, res, next) => {
    try {
        const deleted = await repository.delete(req.params.id);
        if (!deleted) {
            return res.status(404).send({ message: 'Produto não encontrado.' }); // Mensagem amigável caso o produto não exista
        }
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (e) {
        console.error('Erro ao remover produto:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível remover o produto. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};
