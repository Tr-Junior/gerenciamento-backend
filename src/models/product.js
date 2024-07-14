const { useColors } = require('debug/src/browser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    codigo: {
        type: String,
        required: true,
        trim: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    },
    min_quantity: {
        type: Number,
        required: true,
        trim: true
    },
    purchasePrice: {
        type: Number,
        trim: true
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
});


module.exports = mongoose.model('Product', schema);