
const mongoose = require('mongoose');
const Budget = mongoose.model('Budget');

exports.get = async (data) => {
    var res = await Budget.find({})
    return res;
}

exports.create = async (data) => {
    var budget = new Budget(data)
    await budget.save();
}

exports.delete = async (id) => {
    await Budget.findByIdAndDelete(id);
}
