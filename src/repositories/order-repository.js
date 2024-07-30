const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Order = mongoose.model('Order');

exports.get = async (data) => {
    let res = await Order.find({}, 'number createDate customer sale')
        .populate('customer', 'name')
        .populate('sale');
    return res;
}

exports.getSalesByDateRange = async (startDate, endDate) => {
    const query = {};
    
    if (startDate && !endDate) {
        // Se apenas startDate é fornecido, buscamos todas as vendas daquele dia
        const start = moment.tz(startDate, 'America/Sao_Paulo').startOf('day').toDate();
        const end = moment.tz(startDate, 'America/Sao_Paulo').endOf('day').toDate();

        query.createDate = { $gte: start, $lt: end };
    } else if (startDate && endDate) {
        // Se ambos startDate e endDate são fornecidos
        const start = moment.tz(startDate, 'America/Sao_Paulo').startOf('day').toDate();
        const end = moment.tz(endDate, 'America/Sao_Paulo').endOf('day').toDate();

        query.createDate = { $gte: start, $lt: end };
    } else {
        // Se nenhuma data é fornecida, buscamos as vendas do dia atual
        const today = moment.tz('America/Sao_Paulo').startOf('day').toDate();
        const endOfDay = moment.tz('America/Sao_Paulo').endOf('day').toDate();

        query.createDate = { $gte: today, $lt: endOfDay };
    }

    const res = await Order.find(query, 'number createDate customer sale')
        .populate('customer', 'name')
        .populate('sale');
    return res;
}

exports.create = async (data) => {
    let order = new Order(data);
    await order.save();
}

exports.delete = async (id) => {
    await Order.findByIdAndDelete(id);
}

exports.deleteByCode = async (code) => {
    await Order.findOneAndDelete({ number: code });
}
