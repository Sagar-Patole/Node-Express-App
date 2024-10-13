exports.database = {
    host: process.env.SQL_DATABASE_HOST,
    database: process.env.SQL_DATABASE,
    username: process.env.SQL_DATABASE_USER,
    password: process.env.SQL_DATABASE_PASSWORD
}

exports.port = process.env.PORT;

exports.mailConfiguration = {
    senderName: 'Express App',
    email: process.env.EXPRESS_APP_EMAIL,
    password: process.env.EXPRESS_APP_EMAIL_PASSWORD
}

exports.stripe = {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_KEY
}