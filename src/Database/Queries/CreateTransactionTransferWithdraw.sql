-- Transactions table
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    withdraw_id INTEGER,
    transfer_id INTEGER,
    amount REAL,
    transactionDate DATE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (withdraw_id) REFERENCES withdraw(id),
    FOREIGN KEY (transfer_id) REFERENCES transfer(id)
);

-- Withdraw table
CREATE TABLE withdraw (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isWithdraw BOOLEAN,
    isWithdrawFrom BOOLEAN,
    isWithdrawTo BOOLEAN,
    amount REAL,
    transactionDate DATE
);

-- Transfer table
CREATE TABLE transfer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isTransfer BOOLEAN,
    isTransferFrom BOOLEAN,
    isTransferTo BOOLEAN,
    amount REAL,
    transactionDate DATE
);
