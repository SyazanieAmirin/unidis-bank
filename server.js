import express from 'express';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Path to the db
const dbPath = "./src/Database/unidis-bank.db";

// Check if the database file exists
if (!fs.existsSync(dbPath)) {
    console.error('Database file not found');
    process.exit(1); // Exit the process if the file is not found
}

// Create a new SQLite database instance
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database');
    }
});

// Route to handle user registration
app.post('/api/register', (req, res) => {
    const { name, password } = req.body;
    const sql = 'INSERT INTO users (name, password) VALUES (?, ?)';
    db.run(sql, [name, password], function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'User registered', id: this.lastID });
    });
});

// Route to handle user login
app.post('/api/login', (req, res) => {
    const { name, password } = req.body;
    const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
    db.get(sql, [name, password], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
