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
    const regex = new RegExp(`^${title}`, 'i');
    const containsRegex = new RegExp(title, 'i');
    
    // Buscar os produtos que começam com o título
    const startsWith = await Product.find({ title: regex }).limit(25).exec();
    
    // Se a quantidade de resultados ainda é menor que 25, buscar os produtos que contêm o título
    if (startsWith.length < 25) {
        const excludeIds = startsWith.map(product => product._id);
        const contains = await Product.find({ 
            title: containsRegex, 
            _id: { $nin: excludeIds } 
        }).limit(25 - startsWith.length).exec();
        
        return [...startsWith, ...contains];
    }
    
    return startsWith;
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