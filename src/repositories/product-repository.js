const res = require('express/lib/response');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async () => {
    const res = await Product.find({}).sort({ title: 1 }); // Ordenação alfabética pelo campo 'name'
    return res;
};


exports.getBySlug = async (slug) => {
    const res = await Product
        .findOne({
            slug: slug,
            active: true
        }, 'title description price slug tags');
    return res;
}

exports.getById = async (id) => {
    const res = await Product
        .findById(id);
    return res;
}

exports.getByTitle = async (title) => {
    const res = await Product
        .find({ title: { $regex: title, $options: 'i' } }
        ).limit(25);
    return res;
};


exports.create = async (data) => {
    var product = new Product(data)
    await product.save();
}

exports.update = async (id, data) => {
    await Product.findByIdAndUpdate(id, {
        $set: {
            title: data.title,
            quantity: data.quantity,
            min_quantity: data.min_quantity,
            purchasePrice: data.purchasePrice,
            price: data.price
        }
    });
}


exports.delete = async (id) => {
    await Product.findByIdAndDelete(id);
}