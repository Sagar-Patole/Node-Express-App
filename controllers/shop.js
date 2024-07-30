const Product = require('../models/product');
const Cart = require('../models/cart');

const getIndex = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/index', {
            products: products,
            docTitle: 'My Shop',
            path: '/'
        });
    }));
};

const getAllProducts = (req, res, next) => {
    Product.fetchAll((products => {
        res.render('shop/products', {
            products: products,
            docTitle: 'Your Products',
            path: '/products'
        });
    }));
};

const getProductById = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId, product => {
        res.render('shop/product-details', {
            docTitle: product.title,
            path: '/products',
            product: product
        });
    });
}

const getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
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
        });
    });
}

const postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price, () => {
            res.redirect('/cart');
        });
    });
}

const postDeleteCartItem = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price, () => {
            res.redirect('/cart');
        });
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