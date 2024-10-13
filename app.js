require('dotenv').config();
// const https = require('https');
const path = require('path');
const fs = require('fs');

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config/config');
const db = require('./utils/database');
const rootDir = require('./utils/path');
const commonUtils = require('./utils/common');
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

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/images');
    },
    filename: (req, file, cb) => {
        cb(null, commonUtils.formatDateToIST(new Date()).replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');
const accessLogStream = fs.createWriteStream(path.join(rootDir, 'access.log'), {flags: 'a'});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(rootDir, 'public')));
app.use('/assets/images', express.static(path.join(rootDir, 'assets/images')));
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
    res.redirect('/500');
    // res.status(500).render('500', {
    //     docTitle: 'Error',
    //     path: '/error-page'
    // });
});

db.getConnection().then(() => {
    // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || config.port);
    app.listen(process.env.PORT || config.port);
}).catch(error => {
    const err = new Error(error);
    err.httpStatusCode = 500;
    console.error(err);
});