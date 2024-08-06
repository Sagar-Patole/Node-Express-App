const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');
const Product = require('./product');

const p = path.join(rootDir, 'data', 'cart.json');

class Cart {
    static addProduct = (id, productPrice, cb) => {
        fs.readFile(p, (error, fileContent) => {
            let cart = {products: [], totalPrice: 0.00}
            if (!error) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct, quantity: existingProduct.quantity + 1};
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, quantity: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = parseFloat((cart.totalPrice + parseFloat(productPrice)).toFixed(2));

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    cb();
                }
            });
        });
    }

    static deleteProduct = (id, productPrice, cb) => {
        fs.readFile(p, (error, fileContent) => {
            if (error) {
                return;
            } else {
                const updatedCart = { ...JSON.parse(fileContent) };
                const product = updatedCart.products.find(p => p.id === id);
                if (!product) {
                    return cb();
                }
                updatedCart.products = updatedCart.products.filter(p => p.id !== id);
                updatedCart.totalPrice = parseFloat((updatedCart.totalPrice - (parseFloat(productPrice) * product.quantity)).toFixed(2));
                fs.writeFile(p, JSON.stringify(updatedCart), (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        cb();
                    }
                });
            }
        });
    }

    static getCart = (cb) => {
        fs.readFile(p, (error, fileContent) => {
            if (error) {
                cb({});
            } else {
                cb(JSON.parse(fileContent));
            }
        });
    }
}

module.exports = Cart