const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
    '/login',
    [
        check('email').isEmail().withMessage('Please enter a correct email address.'),
        check('password', 'Password should be minimum of 6 charactors.').isLength({min: 6}).trim()
    ],
    authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
    '/signup',
    [
        check('email').isEmail(),
        check('password', 'Password should be minimum of 6 charactors.').isLength({min: 6}).trim(),
        check('confirmPassword').trim().custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match.');
            }
            return true;
        })
    ],
    authController.postSignup
);

router.get('/reset-password', authController.getResetPasword);

router.post('/reset-password', authController.postResetPassword);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;