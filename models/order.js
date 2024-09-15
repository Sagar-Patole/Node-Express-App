const db = require('../utils/database');
const Cart = require('./cart');

class Order {
    static createOrder = async (userId, cartId) => {
        try {
            const [orderData] = await db.execute('INSERT INTO orders (user_id) VALUES (?)', [userId]);
            const orderId = orderData.insertId;
            const [cartItems] = await Cart.getCart(cartId);
            let orderItems = [];
            if (cartItems.length > 0) {
                cartItems.forEach(item => {
                    orderItems.push([orderId, item.product_id, item.quantity]);
                });
            }
            await db.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES ?', [orderItems]);
        } catch (error) {
            const err = new Error(error);
            err.httpStatusCode = 500;
            return next(err);
        }
    }

    static findById = (orderId) => {
        return db.execute(`SELECT orders.id AS order_id, orders.user_id AS user_id, products.id AS product_id, products.name, products.price, order_items.quantity FROM orders
            INNER JOIN order_items ON orders.id = order_items.order_id
            INNER JOIN products ON order_items.product_id = products.id
            WHERE orders.id = ?`, [orderId]);
    }

    static getOrders = (userId) => {
        return db.execute(`SELECT orders.id AS order_id, products.id AS product_id, products.name, products.price, order_items.quantity FROM orders
            INNER JOIN order_items ON orders.id = order_items.order_id
            INNER JOIN products ON order_items.product_id = products.id
            WHERE orders.user_id = ?`, [userId]);
    }
}

module.exports = Order;