const express = require('express');

const authMiddleware = require('../middleware/authentication');
const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getAllProducts);

router.get('/products/:productId', shopController.getProductById);

router.get('/cart', authMiddleware, shopController.getCart);

router.post('/cart', authMiddleware, shopController.postCart);

router.post('/delete-cart-item', authMiddleware, shopController.postDeleteCartItem);

router.get('/checkout', authMiddleware, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

router.get('/orders', authMiddleware, shopController.getOrders);

router.post('/create-order', authMiddleware, shopController.createOrder);

router.get('/checkout', authMiddleware, shopController.getCheckout);

router.get('/orders/:orderId', authMiddleware, shopController.getInvoice);

module.exports = router;