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

    // Function to generate a random 12-digit account number
    function generateAccountNumber() {
        let accountNumber = '';
        for (let i = 0; i < 12; i++) {
            // Generate a random digit (0-9) and append it to the account number string
            accountNumber += Math.floor(Math.random() * 10);
        }
        return accountNumber;
    }

    let accountNumber = generateAccountNumber();

    // Log the generated account number for debugging
    console.log('Generated Account Number:', accountNumber);

    const insertUserSql = 'INSERT INTO users (name, password, account_number) VALUES (?, ?, ?)';
    db.run(insertUserSql, [name, password, accountNumber], function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                // Handle unique constraint violation
                res.status(400).json({ error: 'Username already exists' });
            } else {
                console.error('Error inserting into database:', err.message);
                res.status(500).json({ error: 'Internal server error' });
            }
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

// Route to handle fetching user data by name
app.get('/api/users/:name', (req, res) => {
    const userName = req.params.name;
    const sql = 'SELECT account_number FROM users WHERE name = ?';
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

// Route to handle fetching transactions for a specific user
app.get('/api/user/:id/transactions', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC';
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'Transactions not found for this user' });
        }
    });
});


// Route to handle fetching user ID by name
app.get('/api/userId/:name', (req, res) => {
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

// Route to handle bank transfer
app.post('/api/transfer', (req, res) => {
    const { userId, amount, recipientName, recipientAccountNumber, bankName } = req.body;

    if (!userId || !amount || !recipientName || !recipientAccountNumber || !bankName) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const transactionType = 'transfer';
    const transactionDate = new Date().toISOString().split('T')[0];

    const insertTransactionSql = `
        INSERT INTO transactions (user_id, amount, transaction_type, transaction_date, target_name, target_account_number, bank_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertTransactionSql, [userId, amount, transactionType, transactionDate, recipientName, recipientAccountNumber, bankName], function (err) {
        if (err) {
            console.error('Error inserting transaction:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: 'Transaction successful', transactionId: this.lastID });
    });
});



// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
