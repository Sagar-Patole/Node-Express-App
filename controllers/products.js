const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
    res.render('add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product'
    });
};

const postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

const getAllProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop', {
            products: products,
            docTitle: 'My Shop',
            path: '/'
        });
    }));
};

module.exports = {
    getAddProduct: getAddProduct,
    postAddProduct: postAddProduct,
    getAllProducts: getAllProducts
}