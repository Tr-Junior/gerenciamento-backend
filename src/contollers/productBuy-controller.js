'use strict';


const ValidationContract = require('../validators/validators');
const repository = require('../repositories/productBuy-repository');
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
            return res.status(404).send({ message: 'Produto não encontrado.' }); // Mensagem amigável caso o produto não exista
        }
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter produto por slug:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível obter o produto. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        if (!data) {
            return res.status(404).send({ message: 'Produto não encontrado.' }); // Mensagem amigável caso o produto não exista
        }
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter produto por ID:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível obter o produto. Tente novamente mais tarde.' // Mensagem amigável
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
        console.error('Erro ao buscar produto por título:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível realizar a busca. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};



exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve ter pelo menos 3 caracteres.');
    contract.isRequired(req.body.status, 'O status deve ser preenchido.');

    if (!contract.isValid()) {
        return res.status(400).send({ errors: contract.errors() }); // Envio dos erros de validação
    }

    try {
        // Verificar se existe um produto com o mesmo título
        const existingProduct = await repository.findByTitle(req.body.title);
        if (existingProduct) {
            return res.status(400).send({ message: 'Um produto com o mesmo nome já existe.' }); // Mensagem amigável para duplicidade
        }

        await repository.create({
            title: req.body.title,
            status: req.body.status,
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
        const id = req.params.id || req.body.id;
        if (!id) {
            return res.status(400).send({ message: 'ID do produto é necessário.' }); // Mensagem amigável para falta de ID
        }

        const result = await repository.update(id, req.body);
        if (!result) {
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
