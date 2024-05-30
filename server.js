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

    if (!name || !password) {
        res.status(400).json({ error: 'Name and password are required' });
        return;
    }

    const accountNumber = generateAccountNumber();

    // Log the generated account number for debugging
    console.log('Generated Account Number:', accountNumber);

    const sql = 'INSERT INTO users (name, password, account_number) VALUES (?, ?, ?)';
    db.run(sql, [name, password, accountNumber], function (err) {
        if (err) {
            console.error('Error inserting into database:', err.message);
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

// Route to handle fetching user data by ID
app.get('/api/users/:name', (req, res) => {
    const userName = req.params.name;
    const sql = 'SELECT id FROM users WHERE name = ?';
    db.get(sql, [userName], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Route to handle fetching user name by ID
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT name FROM users WHERE id = ?';
    db.get(sql, [userId], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});



// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
