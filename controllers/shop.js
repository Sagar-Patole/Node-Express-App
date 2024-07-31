const Product = require('../models/product');
const Cart = require('../models/cart');

const getIndex = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/index', {
            products: rows,
            docTitle: 'My Shop',
            path: '/'
        });
    }).catch(error => {
        console.log(error);
    });;
};

const getAllProducts = (req, res, next) => {
    Product.fetchAll().then(([rows, fieldData]) => {
        res.render('shop/products', {
            products: rows,
            docTitle: 'Your Products',
            path: '/products'
        });
    }).catch(error => {
        console.log(error);
    });;
};

const getProductById = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId).then(([rows]) => {
        const product = rows[0];
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product: product
        });
    }).catch(error => {
        console.log(error);
    });
}

const getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll().then(([rows, fieldData]) => {
            const products = rows;
            const cartProducts = [];
            for (product of products) {
                const productInCart = cart.products.find(p => p.id === product.id);
                if (productInCart) {
                    cartProducts.push({productData: product, quantity: productInCart.quantity});
                }
            };
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts
            });
        }).catch(error => {
            console.log(error);
        });
    });
}

const postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId).then(([rows]) => {
        const product = rows[0];
        Cart.addProduct(productId, product.price, () => {
            res.redirect('/cart');
        });
    }).catch(error => {
        console.log(error);
    });
}

const postDeleteCartItem = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId).then(([rows]) => {
        const product = rows[0];
        Cart.deleteProduct(productId, product.price, () => {
            res.redirect('/cart');
        });
    }).catch(error => {
        console.log(error);
    });
}

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Your Orders',
        path: '/orders'
    });
}

const getCheckout = (req, res, next) => {
    res.render('/shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
}

module.exports = {
    getIndex: getIndex,
    getAllProducts: getAllProducts,
    getProductById: getProductById,
    getCart: getCart,
    postCart: postCart,
    postDeleteCartItem: postDeleteCartItem,
    getOrders: getOrders,
    getCheckout: getCheckout
}