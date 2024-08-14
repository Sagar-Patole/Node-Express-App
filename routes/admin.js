const express = require('express');

const authMiddleware = require('../middleware/authentication');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', authMiddleware, adminController.getAddProduct);

router.get('/edit-product/:productId', authMiddleware, adminController.getEditProduct);

router.post('/add-product', authMiddleware, adminController.postAddProduct);

router.post('/edit-product', authMiddleware, adminController.postEditProduct);

router.post('/delete-product', authMiddleware, adminController.postDeleteProduct);

router.get('/products', authMiddleware, adminController.getAllProducts);

module.exports = router;