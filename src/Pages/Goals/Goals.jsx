import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Global/Header';
import GoalsBox from '../../Components/Pages_Based/Goals/GoalsBox';
import BigButton from '../../Components/Global/BigButton';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGoals = async () => {
            const username = localStorage.getItem('username');
            if (username) {
                try {
                    const response = await fetch(`http://localhost:3001/api/userId/${username}`);
                    const data = await response.json();
                    const userId = data.id;
                    const goalsResponse = await fetch(`http://localhost:3001/api/user/${userId}/goals`);
                    const goalsData = await goalsResponse.json();
                    setGoals(goalsData);
                } catch (error) {
                    console.error('Error fetching goals:', error);
                }
            }
        };

        fetchGoals();
    }, []);

    const handleAddNewGoalClick = () => {
        navigate('/goals/add-new-goal');
    };

    const renderGoals = () => {
        const rows = [];
        for (let i = 0; i < goals.length; i += 2) {
            rows.push(
                <div key={i} className='flex flex-row justify-between gap-10 px-20'>
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
            <BigButton title="Add New Goal" onClick={handleAddNewGoalClick} />
        </div>
    );
}
