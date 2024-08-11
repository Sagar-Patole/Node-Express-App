const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        editMode: false
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
            editMode: editMode
        });
    }).catch(error => {
        console.log(error);
    });
}

exports.postAddProduct = (req, res, next) => {
    const userId = req.user.id;
    const {title, imageUrl, price, description} = req.body;
    const product = new Product(null, title, imageUrl, price, description, userId);
    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
};

exports.postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, price, description} = req.body;
    const product = new Product(productId, title, imageUrl, price, description);
    product.save().then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteById(req.body.productId).then(() => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

exports.getAllProducts = (req, res, next) => {
    Product.fetchAll(req.user.id).then(([rows, fieldData]) => {
        res.render('admin/products', {
            products: rows,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    }).catch(error => {
        console.log(error);
    });
}