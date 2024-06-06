import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Global/Header';
import GoalsBox from '../../Components/Pages_Based/Goals/GoalsBox';
import BigButton from '../../Components/Global/BigButton';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [transferAmount, setTransferAmount] = useState('');
    const [moneyInBank, setMoneyInBank] = useState(0);
    const [userId, setUserId] = useState(null); // To store the user ID
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);

        // Fetch user data from backend
        fetch(`https://unidis-bank.onrender.com/api/users/${storedUsername}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Set the account number and money in bank states
                setMoneyInBank(data.money_in_bank);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        fetchData();
    }, []);

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

    const fetchData = async () => {
        const username = localStorage.getItem('username');
        setUsername(username);
        if (username) {
            try {
                const response = await fetch(`https://unidis-bank.onrender.com/api/userId/${username}`);
                const data = await response.json();
                const userId = data.id;
                const [goalsResponse] = await Promise.all([
                    fetch(`https://unidis-bank.onrender.com/api/user/${userId}/goals`)
                ]);
                const [goalsData] = await Promise.all([
                    goalsResponse.json()
                ]);
                setGoals(goalsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleGoalClick = (goal) => {
        setSelectedGoal(goal);
    };

    const handleTransferAmountChange = (e) => {
        setTransferAmount(e.target.value);
    };

    const handleTransferSubmit = async () => {
        // Check if transferAmount exceeds moneyInBank
        if (parseFloat(transferAmount) > moneyInBank) {
            alert('Transfer amount exceeds available bank balance.');
            return;
        }

        try {
            // Get the real user ID
            const response = await fetch(`https://unidis-bank.onrender.com/api/userId/${username}`);
            const data = await response.json();
            const realUserId = data.id;

            // Update the selectedGoal with the correct user ID
            const updatedSelectedGoal = { ...selectedGoal, user_Id: realUserId };

            // Calculate updated current amount
            const updatedCurrentAmount = updatedSelectedGoal.currentAmount + parseFloat(transferAmount);

            // Update the selectedGoal's currentAmount in the frontend
            const updatedGoals = goals.map(goal =>
                goal.name === selectedGoal.name ? { ...goal, currentAmount: updatedCurrentAmount } : goal
            );
            setGoals(updatedGoals);

            // Send an HTTP request to update the goal's currentAmount in the database
            await fetch(`https://unidis-bank.onrender.com/api/goals/${selectedGoal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentAmount: updatedCurrentAmount, transferAmount: parseFloat(transferAmount) }), // Include transferAmount
            });

            // Subtract the transferred amount from the money_in_bank of the user
            const updatedMoneyInBank = moneyInBank - parseFloat(transferAmount);
            setMoneyInBank(updatedMoneyInBank);

            // Send an HTTP request to update the money_in_bank of the user in the database
            await fetch(`https://unidis-bank.onrender.com/api/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ money_in_bank: updatedMoneyInBank }),
            });

            // Prepare transaction data
            const transactionData = {
                userId: realUserId,
                amount: parseFloat(transferAmount),
                targetName: selectedGoal.name, // Assuming the goal name is the target name
                targetAccountNumber: 'N/A', // Update accordingly if you have target account info
                bankName: 'N/A' // Update accordingly if you have bank info
            };

            console.log('Sending transaction data:', transactionData); // Log the transaction data

            // Insert a "goal" transaction
            const transactionResponse = await fetch(`https://unidis-bank.onrender.com/api/goal-transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            const transactionResult = await transactionResponse.json();
            console.log('Transaction result:', transactionResult); // Log the result

            setSelectedGoal(null);
            setTransferAmount('');
        } catch (error) {
            console.error('Error transferring amount:', error);
        }
    };


    const handleAddNewGoalClick = () => {
        navigate('/goals/add-new-goal');
    };

    const handleClosePopup = () => {
        setSelectedGoal(null);
    };

    const renderGoals = () => {
        const rows = [];
        for (let i = 0; i < goals.length; i += 2) {
            rows.push(
                <div key={i} className='flex flex-row justify-between gap-10 px-20' onClick={() => handleGoalClick(goals[i])}>
                    <GoalsBox
                        goalsName={goals[i].name}
                        goalsCurrent={goals[i].currentAmount}
                        goalsTarget={goals[i].targetAmount}
                    />
                    {goals[i + 1] && (
                        <GoalsBox
                            goalsName={goals[i + 1].name}
                            goalsCurrent={goals[i + 1].currentAmount}
                            goalsTarget={goals[i + 1].targetAmount}
                        />
                    )}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page="Goals" />
            <br /><br />
            <h1 className='font-bold text-xl'>Welcome to Goals! Set goals for everything!</h1>
            <br /><br /><br />
            <div className='flex flex-col w-full justify-between gap-10'>
                {renderGoals()}
            </div>
            <br /><br />
            {selectedGoal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md relative">
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-5 text-4xl transition-all hover:scale-90"
                        >
                            &times;
                        </button>
                        <h2 className="font-bold mb-2">Transfer Money to {selectedGoal.name} Goal</h2>
                        <p className="mb-4">Current amount: RM{selectedGoal && selectedGoal.currentAmount ? selectedGoal.currentAmount.toFixed(2) : '0.00'}</p>
                        <p className='mb-4'>Money In Bank: RM{moneyInBank ? moneyInBank.toFixed(2) : 'N/A'}</p>

                        <div className='flex flex-row gap-5'>
                            <input
                                type="number"
                                placeholder="Enter amount to transfer"
                                value={transferAmount}
                                onChange={handleTransferAmountChange}
                                className="border bg-black text-white rounded-full p-3"
                            />
                            <button onClick={handleTransferSubmit} className="bg-black text-white px-4 py-2 rounded-full transition-all hover:scale-90">Transfer</button>
                        </div>
                    </div>
                </div>
            )}
            <br /><br />
            <BigButton title="Add New Goal" onClick={handleAddNewGoalClick} />
        </div>
    );

}
