const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getAllProducts);

router.get('/products/:productId', shopController.getProductById);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/delete-cart-item', shopController.postDeleteCartItem);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.createOrder);

router.get('/checkout', shopController.getCheckout);

module.exports = router;