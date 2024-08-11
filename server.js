const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config/config');
const db = require('./utils/database');
const rootDir = require('./utils/path');
const User = require('./models/user');
const Cart = require('./models/cart');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use(async (req, res, next) => {
    try {
        const [userData, userFieldData] = await User.findById(2);
        const [cartData, cartFieldData] = await Cart.findById(userData[0].id);
        req.user = userData[0];
        req.user.cartId = cartData[0].id;
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

db.getConnection().then( async () => {
    try {
        const [userRows, userFieldData] = await User.findById(2);
        let userData;
        if (userRows.length > 0) {
            [userData] = userRows;
        } else {
            const user = new User('Sagar', 'test@test.com');
            [userData] = await user.save();
        }

        if (userData) {
            const [cartRows, cartFieldData] = await Cart.findById(userData.id || userData.insertId);
            if (cartRows.length === 0) {
                const cart = new Cart(userData.id || userData.insertId);
                await cart.save();
            }
            app.listen(config.port);
        }
    } catch (err) {
        console.log(err);
    }
}).catch(error => {
    console.log(error);
});