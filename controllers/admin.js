const { validationResult } = require('express-validator');

const commonUtils = require('../utils/common');
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
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    });
}

exports.postAddProduct = (req, res, next) => {
    const userId = req.session.user.id;
    const {title, price, description} = req.body;
    const image = req.file;
    const errors = validationResult(req);
    if (!errors.isEmpty() || !image) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add Product',
            path: '/admin/add-product',
            editMode: false,
            hasError: true,
            product: {
                name: title,
                price: price,
                description: description
            },
            errorMessage: errors.array().length > 0 ?  errors.array()[0].msg : 'Attached file is not an image.',
            validationErrors: errors.array()
        });
    }
    const product = new Product(null, title, image.path, price, description, userId);
    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    });
};

exports.postEditProduct = async (req, res, next) => {
    try {
        const userId = req.session.user.id;
        const {productId, title, price, description} = req.body;
        const image = req.file;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/edit-product', {
                docTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: {
                    name: title,
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
        const [productData, productFieldData] = await Product.findById(productId);
        if (productData.length > 0) {
            if (image) {
                const imageUrl = productData[0].image_url;
                commonUtils.deleteFile(imageUrl);
            }
            const product = new Product(productId, title, image ? image.path : null, price, description, userId);
            await product.save();
            res.redirect('/admin/products');
        } else {
            throw new Error('Product not found.');
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const {productId} = req.body;
        const [productData, productFieldData] = await Product.findById(productId);
        if (productData.length > 0) {
            const imageUrl = productData[0].image_url;
            commonUtils.deleteFile(imageUrl);
            await Product.deleteById(req.body.productId, req.session.user.id);
            res.redirect('/admin/products');
        } else {
            throw new Error('Product not found.');
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll(req.session.user.id).then(([rows, fieldData]) => {
        res.render('admin/products', {
            products: rows,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(error => {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    });
}