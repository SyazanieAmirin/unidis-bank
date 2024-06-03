import { useState, useEffect } from 'react';

export default function RecentTransactionsBox({ title, userName }) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Get user ID by userName
                const userIdResponse = await fetch(`http://localhost:3001/api/userId/${userName}`);
                const userIdData = await userIdResponse.json();
                const userId = userIdData.id;

                // Get transactions by userId
                const transactionsResponse = await fetch(`http://localhost:3001/api/user/${userId}/transactions`);
                const transactionsData = await transactionsResponse.json();

                // Sort transactions by date and slice to get the 5 most recent transactions
                const recentTransactions = transactionsData
                    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
                    .slice(0, 5); // TO CHANGE LIMIT, ITS HERE

                setTransactions(recentTransactions);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [userName]);

    return (
        <div className="bg-black h-auto w-1/2 rounded-md flex flex-col px-7 py-4 gap-3">
            <h1 className="font-bold text-white">{title}</h1>
            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <div key={transaction.id} className="flex flex-row justify-between text-white px-5">
                        <p>
                            {transaction.transaction_type.toUpperCase()} {transaction.transaction_type === 'withdrawal' ? 'from ATM' : `to ${transaction.target_name}`}
                        </p>
                        <div className="flex flex-row justify-between text-white gap-3">
                            <p>RM {transaction.amount.toFixed(2)}</p>
                            <p>{new Date(transaction.transaction_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))
            ) : ( // IF ELSE - IF LENGTH > 0 (GOT VALUE) HENCE (THINGS TO DO) : ELSE
                <p className="text-white">No transactions found.</p>
            )}
        </div>
    );
}
