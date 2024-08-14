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
}

module.exports = User;