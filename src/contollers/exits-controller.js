'use strict';


const ValidationContract = require('../validators/validators');
const repository = require('../repositories/exits-repository');
const azure = require('azure-storage');
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


exports.getByTitle = async (req, res, next) => {
    try {
        const data = await repository.getByTitle(req.params.description);
        if (!data) {
            return res.status(404).send({ message: 'Registro não encontrado.' }); // Mensagem amigável caso o registro não exista
        }
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter registro por título:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível obter o registro. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.description, 3, 'O título deve ter pelo menos 3 caracteres.');
    contract.hasMinLen(req.body.value, 1, 'O valor deve ser informado.');
    contract.hasMinLen(req.body.formPaymentExit, 1, 'A forma de pagamento deve ser informada.');
    contract.hasMinLen(req.body.date, 3, 'A data é requerida.');

    if (!contract.isValid()) {
        return res.status(400).send({ errors: contract.errors() }); // Envio dos erros de validação
    }

    try {
        await repository.create({
            description: req.body.description,
            value: req.body.value,
            formPaymentExit: req.body.formPaymentExit,
            date: req.body.date
        });
        res.status(201).send({
            message: 'Saída cadastrada com sucesso!'
        });
    } catch (e) {
        console.error('Erro ao cadastrar saída:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível cadastrar a saída. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.put = async (req, res, next) => {
    try {
        const updated = await repository.update(req.body.id, req.body);
        if (!updated) {
            return res.status(404).send({ message: 'Registro não encontrado.' }); // Mensagem amigável caso o registro não exista
        }
        res.status(200).send({ message: 'Saída atualizada com sucesso!' });
    } catch (e) {
        console.error('Erro ao atualizar saída:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível atualizar a saída. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.delete = async (req, res, next) => {
    try {
        const deleted = await repository.delete(req.params.id);
        if (!deleted) {
            return res.status(404).send({ message: 'Registro não encontrado.' }); // Mensagem amigável caso o registro não exista
        }
        res.status(200).send({
            message: 'Saída removida com sucesso!'
        });
    } catch (e) {
        console.error('Erro ao remover saída:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível remover a saída. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};
