const Product = require('../models/product');
const Cart = require('../models/cart');

const getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            products: products,
            docTitle: 'My Shop',
            path: '/'
        });
    }).catch(error => {
        console.log(error);
    });
};

const getAllProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/products', {
            products: products,
            docTitle: 'Your Products',
            path: '/products'
        });
    }).catch(error => {
        console.log(error);
    });
};

const getProductById = (req, res, next) => {
    const { productId } = req.params;
    Product.findByPk(productId).then(product => {
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
    req.user.getCart().then(cart => {
        return cart.getProducts();
    }).then(products => {
        res.render('shop/cart', {
            docTitle: 'Your Cart',
            path: '/cart',
            products: products
        });
    }).catch(error => {
        console.log(error);
    });
}

const postCart = (req, res, next) => {
    const { productId } = req.body;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where: {id: productId}});
    }).then(products => {
        let product;
        if (products.length > 0) {
            product = products[0];
        }
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(productId);
    }).then(product => {
        return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
    }).then(() => {
        res.redirect('/cart');
    }).catch(error => {
        console.log(error);
    });
}

const postDeleteCartItem = (req, res, next) => {
    const { productId } = req.body;
    req.user.getCart().then(cart => {
        return cart.getProducts({where: {id: productId}});
    }).then(([product]) => {
        return product.cartItem.destroy();
    }).then(result => {
        res.redirect('/cart');
    }).catch(error => {
        console.log(error);
    });
}

const getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']}).then(orders => {
        res.render('shop/orders', {
            docTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    }).catch(error => {
        console.log(error);
    });
}

const postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    }).then(products => {
        return req.user.createOrder().then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = {quantity: product.cartItem.quantity};
                return product;
            }));
        }).catch(err => {
            console.log(err);
        });
    }).then(result => {
        return fetchedCart.setProducts(null);
    }).then(result => {
        res.redirect('/orders');
    }).catch(error => {
        console.log(error);
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
    postOrder: postOrder
}