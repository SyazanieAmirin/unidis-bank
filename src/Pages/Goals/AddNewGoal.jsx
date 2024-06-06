import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Global/Header';
import BigButton from '../../Components/Global/BigButton';
import InputField from '../../Components/Global/InputField';

export default function AddNewGoal() {
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [userId, setUserId] = useState(null); // State to store user ID
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the current user ID using the user's name from localStorage
        const userName = localStorage.getItem('username'); // Assuming the user name is stored in localStorage
        if (userName) {
            fetch(`http://https://unidis-bank.onrender.com/api/userId/${userName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        setUserId(data.id);
                    } else {
                        alert('User ID not found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching user ID:', error);
                });
        }
    }, []);

    const handleAddNewGoal = () => {
        if (!userId) {
            alert('User ID not found');
            return;
        }

        const newGoal = {
            name: goalName,
            targetAmount: parseFloat(targetAmount),
            currentAmount: 0, // Set initial currentAmount to 0
            userId
        };

        fetch('http://https://unidis-bank.onrender.com/api/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGoal)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Goal added successfully');
                    navigate('/goals'); // Navigate back to the goals page after adding
                }
            })
            .catch(error => {
                console.error('Error adding goal:', error);
                alert('Error adding goal');
            });
    };

    return (
        <div className="flex flex-col items-center py-5 w-full max-w-[1200px] m-auto">
            <Header current_page="Add New Goal" />
            <br /><br />
            <InputField
                isShowTitle={true}
                title="Goal Name"
                placeholder="Input your goal name here"
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
            />
            <InputField
                isShowTitle={true}
                title="Goal's Target Amount"
                placeholder="Input your goal's target amount here"
                type="text"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
            />
            <br /><br />
            <BigButton title="Add New" onClick={handleAddNewGoal} />
        </div>
    );
}
