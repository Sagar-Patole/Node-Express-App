const db = require('../utils/database');

class User {
    constructor(name, email) {
        this.name = name,
        this.email = email
    }

    save = () => {
        return db.execute('INSERT INTO users (name, email) VALUES (?, ?)', [this.name, this.email]);
    }

    static findById = (userId) => {
        return db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    }
}

module.exports = User;