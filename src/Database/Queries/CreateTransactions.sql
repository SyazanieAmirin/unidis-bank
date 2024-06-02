CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,  -- ID of the user performing the transaction
    amount REAL NOT NULL,      -- Amount of the transaction
    transaction_type TEXT NOT NULL, -- Type of transaction ('withdrawal', 'transfer_in', 'transfer_out')
    transaction_date DATE NOT NULL, -- Date of the transaction
    target_name TEXT,          -- Name of the target user, NULL for withdrawals
    FOREIGN KEY (user_id) REFERENCES users(id)
);