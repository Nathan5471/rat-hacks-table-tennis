import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/AuthAPIHandler';

export default function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const registerHandler = async (e) => {
        e.preventDefault();
        const userInfo = {
            fullName,
            email,
            password
        }
        try {
            await register(userInfo);
            navigate('/login');
        } catch (error) {
            if (error === 'All fields are required') {
                setError('All fields are required');
            }
            else if (error === 'Email already registered') {
                setError('Email already registered');
            } else {
                setError('An unknown error occurred during login');
            }
        }
    }

    return (
        <div className="bg-gray-300 flex items-center justify-center min-h-screen">
            <form className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                    />
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                    />
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                    />
                    <button type="submit" onClick={registerHandler} className="bg-[#144922] text-white p-2 rounded-md mt-2 w-full transform transition duration-200 ease-in-out hover:scale-105 hover:bg-[#62A663] focus:outline-none">Register</button>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-gray-700">Already have an account? <a href="/login" className="text-[#144922] hover:underline">Login</a></p>
                </div>
            </form>
        </div>
    )
}