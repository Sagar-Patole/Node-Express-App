const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        editMode: false
    });
};

const getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;
    Product.findById(productId, product => {
        res.render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            editMode: editMode
        });
    });
}

const postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    const product = new Product(null, title, imageUrl, price, description);
    product.save(() => {
        res.redirect('/admin/products');
    });
};

const postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, price, description} = req.body;
    const product = new Product(productId, title, imageUrl, price, description);
    product.save(() => {
        res.redirect('/admin/products');
    });
}

const postDeleteProduct = (req, res, next) => {
    Product.deleteById(req.body.productId, () => {
        res.redirect('/admin/products');
    });
}

const getAllProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('admin/products', {
            products: products,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    }));
}

module.exports = {
    getAddProduct: getAddProduct,
    getEditProduct: getEditProduct,
    postAddProduct: postAddProduct,
    postEditProduct: postEditProduct,
    postDeleteProduct: postDeleteProduct,
    getAllProducts: getAllProducts
}