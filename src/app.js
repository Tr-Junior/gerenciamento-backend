const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const router = express.Router();
const cors = require('cors');
require("dotenv").config();
const moment = require('moment-timezone');

mongoose.connect(process.env.MONGO_URL);
moment.tz.setDefault('America/Sao_Paulo');
app.use(cors());

app.use(bodyParser.json(
    { limit: '5mb' }
));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('frontend'));

app.use(function (req, res, next) {
    res.header('Access-Control-Alloe-Origin', '*');
    res.header('Access-Control-Alloe-Origin', 'Origin, X-Requested-with, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Alloe-Origin', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');
const Entrance = require('./models/entrance');
const Exits = require('./models/exits');
const Budget = require('./models/budget');
const ProductBuy = require('./models/productBuy');


const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-routes');
const entranceRoute = require('./routes/entrance-route');
const exitRoute = require('./routes/exits-route');
const budgetRoute = require('./routes/budget-route');
const productBuyRoute = require('./routes/productBuy-route');



app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);
app.use('/entrance', entranceRoute);
app.use('/exits', exitRoute);
app.use('/budget', budgetRoute);
app.use('/productBuy', productBuyRoute);




module.exports = app;