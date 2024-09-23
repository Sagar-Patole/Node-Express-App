const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const rootDir = require('../utils/path');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getIndex = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = ITEMS_PER_PAGE;
        const offset = page ? (page * ITEMS_PER_PAGE - ITEMS_PER_PAGE) : 0;
        const [[{totalItems}]] = await Product.getNumberOfProducts();
        const [[rows, fieldData]] = await Product.fetchAll(null, limit, offset);
        res.render('shop/index', {
            products: rows,
            docTitle: 'My Shop',
            path: '/',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = ITEMS_PER_PAGE;
        const offset = page ? (page * ITEMS_PER_PAGE - ITEMS_PER_PAGE) : 0;
        const [[{totalItems}]] = await Product.getNumberOfProducts();
        const [[rows, fieldData]] = await Product.fetchAll(null, limit, offset);
        res.render('shop/products', {
            products: rows,
            docTitle: 'Your Products',
            path: '/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
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
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
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
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    });
}

exports.postCart = (req, res, next) => {
    const { cartId } = req.session.user;
    const { productId } = req.body;
    Cart.addProduct(cartId, productId).then(() => {
        res.redirect('/cart');
    }).catch(error => {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    });
}

exports.postDeleteCartItem = (req, res, next) => {
    const { cartId } = req.session.user;
    const { productId } = req.body;
    Cart.deleteProduct(cartId, productId).then(() => {
        res.redirect('/cart');
    }).catch(error => {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
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
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    });
}

exports.createOrder = (req, res, next) => {
    const { cartId } = req.body;
    const userId = req.session.user.id;
    Order.createOrder(userId, cartId).then(() => {
        res.redirect('/orders');
        Cart.clearCart(cartId);
    }).catch(error => {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    });
}

exports.getInvoice = async (req, res, next) => {
    try {
        const {orderId} = req.params;
        const invoiceName = 'invoice' + '-' + orderId + '.pdf';
        const invoicePath = path.join(rootDir, 'data', 'invoices', invoiceName);
        const [orderData, orderFieldData] = await Order.findById(orderId);
        if (orderData.length > 0) {
            if (orderData[0].user_id !== req.session.user.id) {
                return next(new Error('Unauthorized access.'));
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text('Invoice');
            pdfDoc.text('------------------------------------------------');
            let totalPrice = 0;
            orderData.forEach(item => {
                totalPrice = totalPrice + (item.price * item.quantity);
                pdfDoc.fontSize(14).text(`${item.name} - ${item.quantity} x $${item.price}`);
            });
            pdfDoc.text('-------------------------------------------------------');
            pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
            pdfDoc.end();
        } else {
            throw new Error('No order found.');
        }
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.getCheckout = (req, res, next) => {
    res.render('/shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
}
