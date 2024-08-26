const db = require('../utils/database');

class User {
    constructor(email, password) {
        this.email = email,
        this.password = password
    }

    save = () => {
        return db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [this.email, this.password]);
    }

    static findById = (userId) => {
        return db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    }

    static findByEmail = (email) => {
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    static findByResetPasswordToken = (token) => {
        return db.execute('SELECT * FROM users WHERE reset_password_token = ?', [token]);
    }

    static saveResetPasswordInfo = (email, resetPasswordToken, resetPasswordTokenExpiration) => {
        return db.execute('UPDATE users SET reset_password_token = ?, reset_password_token_expiration = ? WHERE email = ?', [resetPasswordToken, resetPasswordTokenExpiration, email]);
    }

    static saveNewPasswordInfo = (userId, newPassword) => {
        return db.execute('UPDATE users SET password = ?, reset_password_token = ?, reset_password_token_expiration = ? WHERE id = ?', [newPassword, null, null, userId]);
    }
}

module.exports = User;