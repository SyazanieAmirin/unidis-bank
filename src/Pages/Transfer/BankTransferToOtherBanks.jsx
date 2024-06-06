import { useEffect, useState } from 'react';

import Header from "../../Components/Global/Header"
import InputField from '../../Components/Global/InputField';
import BigButton from '../../Components/Global/BigButton';

export default function BankTransferToOtherBanks() {

    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
    const [username, setUsername] = useState('');
    const [moneyInBank, setMoneyInBank] = useState(0);
    const [bankName, setBankName] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        const fetchUserId = async () => {
            try {
                const response = await fetch(`https://unidis-bank.onrender.com/api/userId/${storedUsername}`);
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

        const fetchUserId = async () => {
            try {
                const response = await fetch(`https://unidis-bank.onrender.com/api/users/${storedUsername}`);
                const data = await response.json();
                setMoneyInBank(data.money_in_bank);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        if (storedUsername) {
            fetchUserId();
        }
    }, []);

    const handleTransfer = async () => {
        if (!userId) {
            alert('User ID not found');
            return;
        }

        const transferData = {
            userId,
            amount,
            recipientName,
            recipientAccountNumber,
            bankName,
        };

        try {
            const response = await fetch('/api/userIdAndAdd/:name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferData),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Transfer successful');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page="Transfer to Other Banks" />
            <br /><br />
            <h1 className="font-bold text-xl">ATTENTION: Only FROM Unidis Bank TO Non-Unidis Bank</h1>
            <br></br>
            <h2 className="font-bold text-2xl">Money In Bank: RM{moneyInBank.toFixed(2)}</h2>
            <InputField
                isShowTitle={true}
                title="Amount"
                placeholder="Input your amount here. Numerics only."
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <InputField
                isShowTitle={true}
                title="Receipient’s Name"
                placeholder="Input the receipient’s (receiver) name here"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value.toUpperCase())}
            />
            <InputField
                isShowTitle={true}
                title="Receipient’s Account Number"
                placeholder="Input the receipient’s account number here."
                type="number"
                value={recipientAccountNumber}
                onChange={(e) => setRecipientAccountNumber(e.target.value)}
                limitMax={10}
                limitMin={1}
            />
            <InputField
                isShowTitle={true}
                title="Bank Name"
                placeholder="Put the bank name here. E.g. Maybank, CIMB, etc."
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value.toUpperCase())}
            />
            <br /><br />
            <BigButton title="Transfer" onClick={handleTransfer} />
        </div>
    )
}

// TAK SIAP LAGI. PART TUKAR NI WITH SERVER JS PUNYA NEW API