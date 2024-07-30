const fs = require('fs');
const path = require('path');

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

    save = (cb) => {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(p => p.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        cb();
                    }
                });
            } else {
                this.id = parseInt(Math.random() * 1000000).toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        cb();
                    }
                });
            }
        });
    }

    static fetchAll = (cb) => {
        getProductsFromFile(cb);
    }

    static findById = (id, cb) => {
        getProductsFromFile(products => {
            const product = products.find(product => product.id === id);
            cb(product);
        })
    }

    static deleteById = (id, cb) => {
        getProductsFromFile(products => {
            const updatedProducts = products.filter(p => p.id !== id);
            this.findById(id, product => {
                fs.writeFile(p, JSON.stringify(updatedProducts), error => {
                    if (!error) {
                        Cart.deleteProduct(id, product.price, () => {
                            cb();
                        });
                    }
                });
            });
        });
    }
}

module.exports = Product;