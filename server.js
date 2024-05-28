import express from 'express'; // Import the express module
import fs from 'fs'; // Import the fs module
import sqlite3 from 'sqlite3'; // Import the sqlite3 module

const app = express(); // Create an Express application
const port = 3001; // Define the port number

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

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
