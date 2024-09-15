const express = require('express');
const { check } = require('express-validator');

const authMiddleware = require('../middleware/authentication');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', authMiddleware, adminController.getAddProduct);

router.get('/edit-product/:productId', authMiddleware, adminController.getEditProduct);

router.post(
    '/add-product',
    [
        check('title').isLength({min: 2}).trim(),
        check('price').isFloat(),
        check('description').isLength({min: 5, max: 400}).trim()
    ],
    authMiddleware,
    adminController.postAddProduct
);

router.post(
    '/edit-product',
    [
        check('title').isLength({min: 2}).trim(),
        check('price').isFloat(),
        check('description').isLength({min: 5, max: 400}).trim()
    ],
    authMiddleware,
    adminController.postEditProduct
);

router.post('/delete-product', authMiddleware, adminController.postDeleteProduct);

router.get('/products', authMiddleware, adminController.getAllProducts);

module.exports = router;