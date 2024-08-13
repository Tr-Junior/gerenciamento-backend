
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');
require("dotenv").config();


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


exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        if (!data) {
            return res.status(404).send({
                message: 'Registro não encontrado.' // Mensagem amigável para dado não encontrado
            });
        }
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter dados por ID:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível obter os dados. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.getByName = async (req, res, next) => {
    try {
        const data = await repository.checkUsernameExists(req.params.name);
        if (!data) {
            return res.status(404).send({
                message: 'Nome de usuário não encontrado.' // Mensagem amigável para nome não encontrado
            });
        }
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter dados por nome:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível obter os dados. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};




exports.updatePassword = async (req, res, next) => {
    try {
        await repository.updatePassword(req.body.id, req.body);
        res.status(200).send({ message: 'Senha atualizada com sucesso!' });
    } catch (e) {
        console.error('Erro ao atualizar senha:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível atualizar a senha. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve ter pelo menos 3 caracteres.');
    contract.hasMinLen(req.body.password, 6, 'A senha deve ter pelo menos 6 caracteres.');

    if (!contract.isValid()) {
        return res.status(400).send(contract.errors()).end(); // Resposta de validação de contrato
    }

    try {
        await repository.create({
            name: req.body.name,
            password: md5(req.body.password + process.env.SALT_KEY),
            roles: req.body.roles,
        });

        res.status(201).send({
            message: 'Usuário cadastrado com sucesso.' // Mensagem de sucesso
        });
    } catch (e) {
        console.error('Erro ao cadastrar usuário:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível cadastrar o usuário. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const user = await repository.authenticate({
            name: req.body.name,
            password: md5(req.body.password + process.env.SALT_KEY),
        });

        if (!user) {
            return res.status(404).send({
                message: 'Usuário ou senha inválidos.' // Mensagem amigável para falha de autenticação
            });
        }

        const token = await authService.generateToken({
            _id: user._id,
            name: user.name,
            roles: user.roles,
        });

        res.status(201).send({
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                roles: user.roles,
            },
        });
    } catch (e) {
        console.error('Erro na autenticação:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível autenticar. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const user = await repository.getById(data._id);

        if (!user) {
            return res.status(404).send({
                message: 'Usuário não encontrado.' // Mensagem amigável para usuário não encontrado
            });
        }

        const tokenData = await authService.generateToken({
            _id: user._id,
            name: user.name,
            roles: user.roles,
        });

        res.status(201).send({
            token: tokenData,
            user: {
                _id: user._id,
                name: user.name,
                roles: user.roles,
            },
        });
    } catch (e) {
        console.error('Erro ao atualizar token:', e.message); // Log de erro detalhado
        res.status(500).send({
            message: 'Não foi possível atualizar o token. Por favor, tente novamente mais tarde.' // Mensagem amigável
        });
    }
};
