import { useEffect, useState } from 'react';
import Header from '../../Global/Header';

export default function User_Dashboard() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []);

    return (
        <div className="flex flex-col items-center py-5">
            <Header current_page={"Home"} />
            <h1 className="mt-14 font-bold">Welcome, {username}</h1>
        </div>
    );
}

// Bubuh nombor account pulak kat bawah