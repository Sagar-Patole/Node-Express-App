const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        editMode: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;
    Product.findById(productId).then(([rows]) => {
        const product = rows[0];
        res.render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            editMode: editMode,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        });
    }).catch(error => {
        console.log(error);
    });
}

exports.postAddProduct = (req, res, next) => {
    const userId = req.session.user.id;
    const {title, imageUrl, price, description} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product',
            path: '/admin/add-product',
            editMode: false,
            hasError: true,
            product: {
                name: title,
                image_url: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const product = new Product(null, title, imageUrl, price, description, userId);
    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
};

exports.postEditProduct = (req, res, next) => {
    const userId = req.session.user.id;
    const {productId, title, imageUrl, price, description} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: {
                name: title,
                image_url: imageUrl,
                price: price,
                description: description,
                id: productId
            },
            editMode: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const product = new Product(productId, title, imageUrl, price, description, userId);
    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteById(req.body.productId, req.session.user.id).then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll(req.session.user.id).then(([rows, fieldData]) => {
        res.render('admin/products', {
            products: rows,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(error => {
        console.log(error);
    });
}