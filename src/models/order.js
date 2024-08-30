const { useColors } = require('debug/src/browser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

// const schema = new Schema({
//     customer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Customer'
//     },
//     number: {
//         type: String,
//         required: true
//     },
//     client:{
//         type: String,
//         trim: true
//     },
//     sale: {
//         items: [{
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product'
//             },
//             title: {
//                 type: String,
//                 trim: true
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//                 trim: true
//             },
//             price: {
//                 type: Number,
//                 required: true,
//                 trim: true
//             },
//            purchasePrice: {
//                 type: Number,
//                 required: true,
//                 trim: true
//             },
//         }],
//         discount: {
//             type: Number,
//             trim: true
//         },
//         total: {
//             type: Number,
//             trim: true
//         },
//         formPayment: {
//             type: String,
//             trim: true
//         }
//     },
//     createDate: {
//         type: Date,
//         required: true,
//         default: Date.now
//     },
// });

// module.exports = mongoose.model('Order', schema);

const PaymentSchema = new Schema({
    method: {
        type: String,
        required: true, // Exemplo: "dinheiro", "débito", "crédito", etc.
        trim: true
    },
    amount: {
        type: Number,
        required: true // Valor pago com essa forma de pagamento
    }
});

const SaleSchema = new Schema({
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        title: {
            type: String,
            trim: true
        },
        quantity: {
            type: Number,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        purchasePrice: {
            type: Number,
            required: true,
            trim: true
        },
    }],
    discount: {
        type: Number,
        trim: true
    },
    total: {
        type: Number,
        trim: true
    },
    payments: [PaymentSchema] // Array de formas de pagamento
});

const OrderSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    number: {
        type: String,
        required: true
    },
    client:{
        type: String,
        trim: true
    },
    sale: SaleSchema,
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Order', OrderSchema);
