'use strict';


const ValidationContract = require('../validators/validators');
const repository = require('../repositories/product-repository');
const guid = require('guid');



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

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.searchByTitle = async (req, res, next) => {
    try {
        const searchTerm = req.body.title; // Assumindo que o termo de pesquisa é enviado no corpo da requisição com o campo "title"
        const data = await repository.getByTitle(searchTerm);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
};



exports.post = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve ter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.quantity, 1, 'A quantidade deve ter pelo menos 1 caractere');
    contract.hasMinLen(req.body.min_quantity, 1, 'A quantidade minima deve ter pelo menos 1 caractere');
    contract.hasMinLen(req.body.purchasePrice, 1, 'O preço de  compra deve ter pelo menos 1 caractere');
    contract.hasMinLen(req.body.price, 1, 'O preço deve ter pelo menos 1 caractere');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.create({
            codigo: guid.raw().substring(0, 6),
            title: req.body.title,
            quantity: req.body.quantity,
            min_quantity: req.body.min_quantity,
            purchasePrice: req.body.purchasePrice,
            price: req.body.price,

        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({ message: 'Produto atualizado!' });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.updateByIdBody = async (req, res, next) => {
    try {
        await repository.update(req.body.id, req.body);
        res.status(200).send({ message: 'Produto atualizado!' });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id)
        res.status(200).send({
            message: 'Produto removido!'
        });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}