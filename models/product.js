const fs = require('fs');
const path = require('path');

const db = require('../utils/database');
const Cart = require('./cart');
const rootDir = require('../utils/path');
const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(p, (error, fileContent) => {
        if (error) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl,
        this.price = price,
        this.description = description
    }

    save = () => {
        return db.execute('INSERT INTO products (title, imageUrl, price, description) VALUES (?, ?, ?, ?)', [this.title, this.imageUrl, this.price, this.description]);
    }

    static fetchAll = () => {
        return db.execute('SELECT * FROM products');
    }

    static findById = (id) => {
      return db.execute('SELECT * FROM products WHERE id = ?', [id]);
    }

    static deleteById = (id, cb) => {
        getProductsFromFile(products => {
            const updatedProducts = products.filter(p => p.id !== id);
            this.findById(id).then(([rows]) => {
                const product = rows[0];
                fs.writeFile(p, JSON.stringify(updatedProducts), error => {
                    if (!error) {
                        Cart.deleteProduct(id, product.price, () => {
                            cb();
                        });
                    }
                });
            }).catch(error => {
                console.log(error);
            });
        });
    }
}

module.exports = Product;