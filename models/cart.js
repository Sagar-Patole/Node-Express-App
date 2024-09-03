const db = require('../utils/database');

class Cart {
    constructor(userId) {
        this.userId = userId
    }

    save = () => {
        return db.execute('INSERT INTO carts (user_id) VALUES (?)', [this.userId]);
    }

    static findById = (userId) => {
        return db.execute('SELECT * FROM carts WHERE user_id = ?', [userId]);
    }

    static getCart = (cartId) => {
        return db.execute(`SELECT carts.id AS cart_id, products.id AS product_id, products.name, products.price, cart_items.quantity FROM carts
            INNER JOIN cart_items ON carts.id = cart_items.cart_id
            INNER JOIN products ON cart_items.product_id = products.id
            WHERE carts.id = ?`, [cartId]);
    }

    static addProduct = async (cartId, productId) => {
        try {
            const [cartItems, cartItemsFieldData] = await db.execute('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
            if (cartItems.length > 0) {
                await db.execute('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?', [cartItems[0].quantity + 1, cartId, productId]);
            } else {
                await db.execute('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, 1]);
            }
        } catch (error) {
            const err = new Error(error);
            err.httpStatusCode = 500;
            return next(err);
        }
    }

    static deleteProduct = (cartId, productId) => {
        return db.execute('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
    }

    static clearCart = (cartId) => {
        return db.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    }
}

module.exports = Cart