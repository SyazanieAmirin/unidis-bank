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
                const response = await fetch(`http://https://unidis-bank.onrender.com/api/userId/${storedUsername}`);
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
                const response = await fetch(`http://https://unidis-bank.onrender.com/api/users/${storedUsername}`);
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

    const handleWithdraw = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            console.error('Invalid withdrawal amount');
            return;
        }

        try {
            // Update the user's money_in_bank
            const updatedMoneyInBank = moneyInBank + parseFloat(amount);
            setMoneyInBank(updatedMoneyInBank);

            // Update the user's money_in_bank in the database
            await fetch(`http://https://unidis-bank.onrender.com/api/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ money_in_bank: updatedMoneyInBank }),
            });

            // Insert a withdrawal transaction
            const withdrawalData = {
                userId,
                amount: parseFloat(amount),
                recipientName: 'SELF',
                recipientAccountNumber: 'N/A',
                bankName: 'UNIDIS BANK',
            };

            await fetch('http://https://unidis-bank.onrender.com/api/withdraw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(withdrawalData),
            });

            // Reset the amount field
            setAmount('');
            console.log('Withdrawal successful');
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            // Rollback the money_in_bank update if there's an error
            setMoneyInBank(moneyInBank);
        }
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
