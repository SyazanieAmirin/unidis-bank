import path from 'path';
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

    const insertUserSql = 'INSERT INTO users (name, password, account_number, money_in_bank) VALUES (?, ?, ?, 0)';
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
    const sql = 'SELECT account_number, money_in_bank FROM users WHERE name = ?';
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

    // Check if user has enough balance
    const checkBalanceSql = `SELECT money_in_bank FROM users WHERE id = ?`;
    db.get(checkBalanceSql, [userId], (err, row) => {
        if (err) {
            console.error('Error checking balance:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (!row || row.money_in_bank < amount) {
            res.status(400).json({ error: 'Insufficient funds' });
            return;
        }

        // User has enough balance, proceed with transaction
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

            // Subtract amount from user's balance
            const updateBalanceSql = `UPDATE users SET money_in_bank = money_in_bank - ? WHERE id = ?`;
            db.run(updateBalanceSql, [amount, userId], function (err) {
                if (err) {
                    console.error('Error updating balance:', err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                res.json({ message: 'Transaction successful', transactionId: this.lastID });
            });
        });
    });
});

// Route to handle adding a NEW goal
app.post('/api/goals', (req, res) => {
    const { name, targetAmount, currentAmount = 0, userId } = req.body;

    if (!name || targetAmount == null || !userId) {
        res.status(400).json({ error: 'Name, target amount, and user ID are required' });
        return;
    }

    // Check if a goal with the same name already exists for the user
    const checkDuplicateGoalSql = 'SELECT * FROM goals WHERE name = ? AND user_id = ?';
    db.get(checkDuplicateGoalSql, [name, userId], (err, row) => {
        if (err) {
            console.error('Error checking duplicate goal:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (row) {
            // If a goal with the same name already exists for the user, return an error
            res.status(400).json({ error: 'Goal with the same name already exist! Choose a different name!' });
            return;
        }

        // If no duplicate goal found, insert the new goal into the database
        const insertGoalSql = 'INSERT INTO goals (name, targetAmount, currentAmount, user_id) VALUES (?, ?, ?, ?)';
        db.run(insertGoalSql, [name, targetAmount, currentAmount, userId], function (err) {
            if (err) {
                console.error('Error inserting into database:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json({ message: 'Goal added successfully', id: this.lastID });
        });
    });
});


// Route to handle fetching all goals for a specific user
app.get('/api/user/:id/goals', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM goals WHERE user_id = ?';
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No goals found for this user' });
        }
    });
});

// Route to handle withdrawals
app.post('/api/withdraw', (req, res) => {
    const { userId, amount } = req.body;

    if (!userId || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
        res.status(400).json({ error: 'Invalid user ID or amount' });
        return;
    }

    const transactionType = 'withdraw';
    const transactionDate = new Date().toISOString().split('T')[0];

    // Add the withdrawn amount to the user's money_in_bank
    const updateMoneyInBankSql = `
        UPDATE users SET money_in_bank = money_in_bank + ?
        WHERE id = ?
    `;

    db.run(updateMoneyInBankSql, [amount, userId], function (err) {
        if (err) {
            console.error('Error updating money_in_bank:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Insert a withdrawal transaction
        const insertTransactionSql = `
            INSERT INTO transactions (user_id, amount, transaction_type, transaction_date, target_name, target_account_number, bank_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(insertTransactionSql, [userId, amount, transactionType, transactionDate, 'Self', 'N/A', 'N/A'], function (err) {
            if (err) {
                console.error('Error inserting withdrawal transaction:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            res.json({ message: 'Withdrawal successful', transactionId: this.lastID });
        });
    });
});

// Route to handle updating the currentAmount of a goal and subtracting from money_in_bank
app.put('/api/goals/:id', (req, res) => {
    const { id } = req.params;
    const { currentAmount, transferAmount } = req.body;

    if (!id || !currentAmount || isNaN(currentAmount) || parseFloat(currentAmount) < 0 || !transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) < 0) {
        res.status(400).json({ error: 'Invalid goal ID or amount' });
        return;
    }

    const getUserSql = `
        SELECT users.money_in_bank
        FROM users
        INNER JOIN goals ON users.id = goals.user_id
        WHERE goals.id = ?
    `;

    db.get(getUserSql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (!row || row.money_in_bank < parseFloat(transferAmount)) {
            res.status(400).json({ error: 'Insufficient funds' });
            return;
        }

        const updateGoalSql = `
            UPDATE goals SET currentAmount = ?
            WHERE id = ?
        `;

        const subtractAmountSql = `
            UPDATE users 
            SET money_in_bank = money_in_bank - ?
            WHERE id = (
                SELECT user_id FROM goals WHERE id = ?
            )
        `;

        db.run(updateGoalSql, [currentAmount, id], function (err) {
            if (err) {
                console.error('Error updating goal:', err.message);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            db.run(subtractAmountSql, [transferAmount, id], function (err) {
                if (err) {
                    console.error('Error subtracting amount from money_in_bank:', err.message);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                res.json({ message: 'Goal updated successfully and money subtracted from money_in_bank', goalId: id });
            });
        });
    });
});

app.post('/api/goal-transaction', (req, res) => {
    const { userId, amount, targetName, targetAccountNumber, bankName } = req.body;

    console.log('Received transaction data:', req.body); // Log the received data

    // Validate user ID and amount
    if (!userId || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
        console.error('Invalid user ID or amount');
        return res.status(400).json({ error: 'Invalid user ID or amount' });
    }

    const transactionType = 'goal'; // Set the transaction type to 'goal'
    const transactionDate = new Date().toISOString().split('T')[0];

    // Insert the goal transaction
    const insertTransactionSql = `
        INSERT INTO transactions (user_id, amount, transaction_type, transaction_date, target_name, target_account_number, bank_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the SQL query
    db.run(insertTransactionSql, [userId, amount, transactionType, transactionDate, targetName, targetAccountNumber, bankName], function (err) {
        if (err) {
            console.error('Error inserting goal transaction:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Goal transaction successful', transactionId: this.lastID });
    });
});

// Route to handle fetching user's money in the bank by ID
app.get('/api/user/:id/money-in-bank', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT money_in_bank FROM users WHERE id = ?';
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

// Route to handle fetching all goals
app.get('/api/goals-info', (req, res) => {
    const sql = 'SELECT * FROM goals';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
