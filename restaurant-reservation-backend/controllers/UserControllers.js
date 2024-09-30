// controllers/UserControllers.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/config');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json({ message: 'User registered successfully' });
        });
    });
};

// Login User
exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

            const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    });
};

// Middleware to protect routes
exports.protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Invalid token:', err.message);
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Store user info from token in request
        next();
    });
};
