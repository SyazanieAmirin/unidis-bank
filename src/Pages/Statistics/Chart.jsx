import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Chart() {
    const [username, setUsername] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [data, setData] = useState([0, 0, 0]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const storedUsername = localStorage.getItem('username');
                setUsername(storedUsername);

                // Get user ID by userName
                const userIdResponse = await fetch(`http://localhost:3001/api/userId/${storedUsername}`);
                const userIdData = await userIdResponse.json();
                const userId = userIdData.id;

                // Get transactions by userId
                const transactionsResponse = await fetch(`http://localhost:3001/api/user/${userId}/transactions`);
                const transactionsData = await transactionsResponse.json();

                setTransactions(transactionsData);

                // Process transactions to separate and sum by type
                const transactionSums = { transfer: 0, withdraw: 0, goal: 0 };
                transactionsData.forEach(transaction => {
                    if (transaction.transaction_type === 'transfer') {
                        transactionSums.transfer += transaction.amount;
                    } else if (transaction.transaction_type === 'withdraw') {
                        transactionSums.withdraw += transaction.amount;
                    } else if (transaction.transaction_type === 'goal') {
                        transactionSums.goal += transaction.amount;
                    }
                });

                // Update chart data
                setData([transactionSums.transfer, transactionSums.withdraw, transactionSums.goal]);

            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [username]);

    return (
        <div className='flex w-1/2 justify-center'>
            <Pie
                datasetIdKey='mainchart'
                data={{
                    labels: ['Transfer Out', 'Withdraw', 'Goals'],
                    datasets: [
                        {
                            label: 'Amount',
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }}
                options={{
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += `RM${context.raw.toFixed(2)}`;
                                    return label;
                                }
                            }
                        },
                    }
                }}
            />
        </div>
    );
}
