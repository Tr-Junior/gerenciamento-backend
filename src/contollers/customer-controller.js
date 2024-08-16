const ValidationContract = require('../validators/validators');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');
require("dotenv").config();


exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.getByName = async (req, res, next) => {
    try {
        const data = await repository.checkUsernameExists(req.params.name);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}



exports.updatePassword = async (req, res, next) => {
    try {
        await repository.updatePassword(req.body.id, req.body);
        res.status(200).send({ message: 'Senha atualizada com sucesso!' });
    } catch (e) {
        res.status(500).send({
            message: 'falha ao processar a requisição'
        });
    }
}


exports.post = async (req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve ser pelo menos 3 caracteres');
    contract.hasMinLen(req.body.password, 6, 'A senha deve ser pelo menos 6 caracteres');
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try {
        await repository.create({

            name: req.body.name,
            password: md5(req.body.password + process.env.SALT_KEY),
            roles: req.body.roles,

        });
        res.status(201).send({
            message: 'Usuário cadastrado'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const user = await repository.authenticate({

            name: req.body.name,
            password: md5(req.body.password + process.env.SALT_KEY)
        });

        if (!user) {
            res.status(404).send({
                message: 'Usuário ou senha invalidos'
            })
            return;
        }

        const token = await authService.generateToken({
            _id: user._id,
            name: user.name,
            roles: user.roles
        })

        res.status(201).send({
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                roles: user.roles
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const user = await repository.getById(data._id);

        if (!user) {
            res.status(404).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            _id: user._id,
            name: user.name,
            roles: user.roles
        });

        res.status(201).send({
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                roles: user.roles
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};