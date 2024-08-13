const path = require('path');

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');

const config = require('./config/config');
const db = require('./utils/database');
const rootDir = require('./utils/path');
const User = require('./models/user');
const Cart = require('./models/cart');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const app = express();
const sessionStore = new MySQLStore({
    expiration: 86400000,
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, db);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({
    secret: 'My secret key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {secure: false, maxAge: 3600000}
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

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