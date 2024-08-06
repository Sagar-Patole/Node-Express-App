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
    Product.findById(productId).then(([rows]) => {
        const product = rows[0];
        res.render('admin/edit-product', {
            docTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            editMode: editMode
        });
    }).catch(error => {
        console.log(error);
    });
}

const postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    const product = new Product(null, title, imageUrl, price, description);
    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
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
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('admin/products', {
            products: rows,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(error => {
        console.log(error);
    });
}

module.exports = {
    getAddProduct: getAddProduct,
    getEditProduct: getEditProduct,
    postAddProduct: postAddProduct,
    postEditProduct: postEditProduct,
    postDeleteProduct: postDeleteProduct,
    getAllProducts: getAllProducts
}