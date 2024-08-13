
const ValidationContract = require('../validators/validators');
const repository = require('../repositories/entrance-repository')
const guid = require('guid');
const authService = require('../services/auth-service');



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


exports.delete = async (req, res, next) => {
    try {
        const product = await repository.delete(req.params.id);
        if (!product) {
            return res.status(404).send({
                message: 'Produto não encontrado.' // Mensagem amigável caso o produto não exista
            });
        }
        res.status(200).send({
            message: 'Produto removido com sucesso!' // Mensagem de sucesso
        });
    } catch (e) {
        console.error('Erro ao remover produto:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível remover o produto. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};


exports.deleteByCode = async (req, res, next) => {
    try {
        const product = await repository.deleteByCode(req.params.code);
        if (!product) {
            return res.status(404).send({
                message: 'Produto não encontrado.' // Mensagem amigável caso o produto não exista
            });
        }
        res.status(200).send({
            message: 'Produto removido com sucesso!' // Mensagem de sucesso
        });
    } catch (e) {
        console.error('Erro ao remover produto por código:', e.message); // Log detalhado do erro
        res.status(500).send({
            message: 'Não foi possível remover o produto. Tente novamente mais tarde.' // Mensagem amigável
        });
    }
};
