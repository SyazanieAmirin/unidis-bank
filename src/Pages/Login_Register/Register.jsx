import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginRegisterHeader from "../../Components/Pages_Based/Login_Register/LoginRegisterHeader";
import InputField from "../../Components/Global/InputField";
import MediumButton from "../../Components/Global/MediumButton";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Move useNavigate hook outside of the function


    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const response = await fetch('http://localhost:3001/api/register', {
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
                <h1 className="w-full text-center font-bold text-2xl">Register</h1>

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
                <InputField
                    isShowTitle={true}
                    title="Confirm Password"
                    placeholder="Type again your password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <p className="my-14">Already have an account? <Link to="/"><span className="text-blue-600 font-bold hover:cursor-pointer">Please click here</span></Link></p>
                <MediumButton text="Register" onClick={handleRegister} />
            </div>
        </div>
    );
}
