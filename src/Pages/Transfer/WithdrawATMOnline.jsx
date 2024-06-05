import { useEffect, useState } from 'react';
import Header from '../../Components/Global/Header';
import InputField from '../../Components/Global/InputField';
import BigButton from '../../Components/Global/BigButton';

export default function WithdrawATMOnline() {
    const [amount, setAmount] = useState('');
    const [userId, setUserId] = useState(null); // To store the user ID
    const [username, setUsername] = useState('');
    const [moneyInBank, setMoneyInBank] = useState(0);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        const fetchUserId = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/userId/${storedUsername}`);
                const data = await response.json();
                setUserId(data.id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        if (storedUsername) {
            fetchUserId();
        }
    }, []);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        const fetchUserMoney = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/users/${storedUsername}`);
                const data = await response.json();
                setMoneyInBank(data.money_in_bank);
            } catch (error) {
                console.error('Error fetching user money:', error);
            }
        };

        if (storedUsername) {
            fetchUserMoney();
        }
    }, []);

    const handleWithdraw = () => {
        console.log('Withdraw button clicked');
    };

    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page="Withdraw ATM" />
            <br /><br />
            <h2 className="font-bold text-2xl">Money In Bank: RM{moneyInBank.toFixed(2)}</h2>
            <InputField
                isShowTitle={true}
                title="Amount to Withdraw"
                placeholder="All the amount will go into your money in bank."
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <br />
            <BigButton title="Withdraw" onClick={handleWithdraw} />
        </div>
    );
}
