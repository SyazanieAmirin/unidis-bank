import { useEffect, useState } from 'react';
import Header from '../../Components/Global/Header';
import RecentTransactionsBox from '../../Components/Global/RecentTransactionsBox';
import BigButton from '../../Components/Global/BigButton';

export default function User_Dashboard() {
    const [username, setUsername] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [moneyInBank, setMoneyInBank] = useState(0);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        // Fetch user data from backend
        fetch(`http://https://unidis-bank.onrender.com/api/users/${storedUsername}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Set the account number state
                setAccountNumber(data.account_number);
                setMoneyInBank(data.money_in_bank);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page={"Home"} />
            <h1 className="mt-14 font-bold text-xl">Welcome, {username}</h1>
            <h1>{accountNumber}</h1>
            <h1 className="mt-2 font-bold text-2xl">RM{moneyInBank.toFixed(2)}</h1>
            <br></br>
            <RecentTransactionsBox title={"Recent Transactions"} userName={username} />
            <br></br><br></br>
            <BigButton title="Contact Customer Support" onClick={() => alert('Contact this number: 0174577406')} />
        </div>
    );
}