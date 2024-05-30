import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginRegisterHeader from "../../Components/Pages_Based/Login_Register/LoginRegisterHeader";
import InputField from "../../Components/Global/InputField";
import MediumButton from "../../Components/Global/MediumButton";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Move useNavigate hook outside of the function

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, password: password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('username', username); // Store username in local storage
            navigate('/user-dashboard');
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="flex flex-col gap-10 items-center">
            <LoginRegisterHeader />

            <div className="w-full max-w-[1200px] flex flex-col items-center">
                <h1 className="w-full text-center font-bold text-2xl">Login</h1>

                <InputField
                    isShowTitle={true}
                    title="Username"
                    placeholder="Input your username here"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                    isShowTitle={true}
                    title="Password"
                    placeholder="Input your password here"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p className="my-14">Do not have an account? <Link to="/register"><span className="text-blue-600 font-bold hover:cursor-pointer">Please click here</span></Link></p>
                <MediumButton text="Login" onClick={handleLogin} />
            </div>
        </div>
    );
}
