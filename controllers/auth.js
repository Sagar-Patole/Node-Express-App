const User = require('../models/user');
const Cart = require('../models/cart');

exports.getLogin = (req, res, next) => {
    res.render('shop/login', {
        docTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = async (req, res, next) => {
    try {
        const [userData, userFieldData] = await User.findById(2);
        const [cartData, cartFieldData] = await Cart.findById(userData[0].id);
        req.session.req.session.isLoggedIn = true;
        req.session.user = userData[0];
        req.session.user.cartId = cartData[0].id;
        req.session.save(err => {
            console.log(err);
            res.redirect('/');
        });
    } catch (error) {
        console.log(error);
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((error) => {
        console.log(error);
        res.redirect('/login');
    });
}