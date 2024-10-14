exports.port = process.env.PORT || 3000;

exports.database = {
    host: process.env.HOST,
    database: process.env.DATABASE,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
}

exports.mailConfiguration = {
    email: process.env.EXPRESS_APP_EMAIL,
    password: process.env.EXPRESS_APP_EMAIL_PASSWORD
}

exports.stripe = {
    secretKey: process.env.SECRET_KEY,
    publishableKey: process.env.PUBLISHABLE_KEY
}