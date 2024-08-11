const db = require('../utils/database');

class Product {
    constructor(id, title, imageUrl, price, description, userId) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl,
        this.price = price,
        this.description = description,
        this.userId = userId
    }

    save = () => {
        if (!this.id) {
            return db.execute('INSERT INTO products (name, image_url, price, description, user_id) VALUES (?, ?, ?, ?, ?)', [this.title, this.imageUrl, this.price, this.description, this.userId]);
        } else {
            return db.execute('UPDATE products SET name = ?, image_url = ?, price = ?, description = ? WHERE id = ?', [this.title, this.imageUrl, this.price, this.description, this.id]);
        }
    }

    static fetchAll = (userId) => {
        if (userId) {
            return db.execute('SELECT * FROM products WHERE user_id = ?', [userId]);
        } else {
            return db.execute('SELECT * FROM products');
        }
    }

    static findById = (id) => {
      return db.execute('SELECT * FROM products WHERE id = ?', [id]);
    }

    static deleteById = (id) => {
        return db.execute('DELETE FROM products WHERE id = ?', [id]);
    }
}

module.exports = Product;