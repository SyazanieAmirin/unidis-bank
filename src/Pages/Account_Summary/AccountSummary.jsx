import { useEffect, useState } from 'react';
import Header from '../../Components/Global/Header';
import TransactionBox from '../../Components/Global/TransactionBox';

export default function AccountSummary() {
    const [username, setUsername] = useState('');

    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        // Fetch user data from backend
        fetch(`http://localhost:3001/api/users/${storedUsername}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Set the account number state
                setAccountNumber(data.account_number);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page={"Account Summary"} />
            <br></br><br></br>
            <h1>{accountNumber}</h1>
            <br></br>
            <TransactionBox title={"All Transactions"} userName={username} />
        </div>
    )
}