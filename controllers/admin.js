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
    req.user.getProducts({where: {id: productId}}).then(([product]) => {
        if (!product) {
            res.render('/');
        } else {
            res.render('admin/edit-product', {
                docTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
                editMode: editMode
            });
        }
    }).catch(error => {
        console.log(error);
    });
}

const postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    }).then(result => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
};

const postEditProduct = (req, res, next) => {
    const {productId, title, imageUrl, price, description} = req.body;
    Product.findByPk(productId).then(product => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        return product.save();
    }).then(result => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

const postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findByPk(productId).then(product => {
        return product.destroy();
    }).then(result => {
        res.redirect('/admin/products');
    }).catch(error => {
        console.log(error);
    });
}

const getAllProducts = (req, res, next) => {
    req.user.getProducts().then(products => {
        res.render('admin/products', {
            products: products,
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