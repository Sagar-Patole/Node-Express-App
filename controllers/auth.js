const bcrypt = require('bcrypt');

const User = require('../models/user');
const Cart = require('../models/cart');

exports.getLogin = (req, res, next) => {
    const message = req.flash('error');
    let errorMessage;
    if (message.length > 0) {
        errorMessage = message[0];
    } else {
        errorMessage = null;
    }
    res.render('shop/login', {
        docTitle: 'Login',
        path: '/login',
        errorMessage: errorMessage
    });
}

exports.postLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const [userData, userFieldData] = await User.findByEmail(email);
        if (userData.length > 0) {
            const hashedPassword = userData[0].password;
            const match = await bcrypt.compare(password, hashedPassword);
            if (match) {
                const [cartData, cartFieldData] = await Cart.findById(userData[0].id);
                req.session.isLoggedIn = true;
                req.session.user = userData[0];
                req.session.user.cartId = cartData[0].id;
                req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            } else {
                req.flash('error', 'Incorrect email or password.');
                res.redirect('/login');
            }
        } else {
            req.flash('error', 'Incorrect email or password.');
            res.redirect('/login');
        }
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

exports.getSignup = (req, res, next) => {
    const message = req.flash('error');
    let errorMessage;
    if (message.length > 0) {
        errorMessage = message[0];
    } else {
        errorMessage = null;
    }
    res.render('shop/signup', {
        docTitle: 'Sign Up',
        path: '/signup',
        errorMessage: errorMessage
    });
}

exports.postSignup = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const [userData, userFieldData] = await User.findByEmail(email);
        if (userData.length > 0) {
            req.flash('error', 'Email you entered is already used. Please enter different email.');
            res.redirect('/signup');
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User(email, hashedPassword);
            const [newUserData] = await user.save();
            const cart = new Cart(newUserData.insertId);
            await cart.save();
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
}