const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('shop', {
        products: adminData.products,
        docTitle: 'My Shop',
        path: '/',
        hasProducts: adminData.products.length > 0,
        productCSS: true,
        activeShop: true
    });
});

module.exports = router;