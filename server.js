const path = require('path');

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');

const config = require('./config/config');
const db = require('./utils/database');
const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');

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

const csrfProtection = csrf();

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
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
    // res.redirect('/500');
    res.status(500).render('500', {
        docTitle: 'Error',
        path: '/error-page'
    });
});

db.getConnection().then(() => {
    app.listen(config.database.port);
}).catch(error => {
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
});