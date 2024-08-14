const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
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

exports.getAllProducts = (req, res, next) => {
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

exports.getProductById = (req, res, next) => {
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

exports.getCart = (req, res, next) => {
    let cart = {id: null, cartItems: [], totalPrice: 0.00};
    Cart.getCart(req.session.user.cartId).then(([_cartItems, fieldData]) => {
        if (_cartItems.length > 0) {
            cart.id = _cartItems[0].cart_id;
            _cartItems.forEach(item => {
                cart.cartItems.push({
                    product: {
                        name: item.name,
                        price: item.price,
                        id: item.product_id
                    },
                    productQuantity: item.quantity
                });
            });
        }
        res.render('shop/cart', {
            docTitle: 'Your Cart',
            path: '/cart',
            cartId: cart.id,
            cartItems: cart.cartItems
        });
    }).catch(error => {
        console.log(error);
    });
}

exports.postCart = (req, res, next) => {
    const { cartId } = req.session.user;
    const { productId } = req.body;
    Cart.addProduct(cartId, productId).then(() => {
        res.redirect('/cart');
    }).catch(error => {
        console.log(error);
    });
}

exports.postDeleteCartItem = (req, res, next) => {
    const { cartId } = req.session.user;
    const { productId } = req.body;
    Cart.deleteProduct(cartId, productId).then(() => {
        res.redirect('/cart');
    }).catch(error => {
        console.log(error);
    });
}

exports.getOrders = (req, res, next) => {
    Order.getOrders(req.session.user.id).then(([_orderItems, fieldData]) => {
        let orders = [];
        const uniqueOrderIds = new Set();
        if (_orderItems.length > 0) {
            _orderItems.forEach(item => {
                if (!uniqueOrderIds.has(item.order_id)) {
                    uniqueOrderIds.add(item.order_id);
                }
            });
            const orderIds = [...uniqueOrderIds];
            orders = orderIds.map(orderId => {
                const order = {id: orderId, orderItems: []};
                _orderItems.forEach(item => {
                    if (item.order_id === order.id) {
                        order.orderItems.push({
                            product: {
                                name: item.name,
                                price: item.price,
                                id: item.product_id
                            },
                            productQuantity: item.quantity
                        });
                    }
                });
                return order;
            });
        }
        res.render('shop/orders', {
            docTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    }).catch(error => {
        console.log(error);
    });
}

exports.createOrder = (req, res, next) => {
    const { cartId } = req.body;
    const userId = req.session.user.id;
    Order.createOrder(userId, cartId).then(() => {
        res.redirect('/orders');
        Cart.clearCart(cartId);
    }).catch(error => {
        console.log(error);
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('/shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
}
