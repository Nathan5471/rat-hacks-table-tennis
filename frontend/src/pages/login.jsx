import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/AuthAPIHandler';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const loginHandler = async (e) => {
        e.preventDefault();
        const userInfo = {
            email,
            password
        }
        try {
            await login(userInfo);
            navigate('/app/home');
        } catch (error) {
            if (error === 'All fields are required') {
                setError('All fields are required');
            }
            else if (error === 'Invalid email or password') {
                setError('Invalid email or password');
            } else {
                setError('An unknown error occurred during login');
            }
        }
    }

    return (
        <div className="bg-gray-300 flex items-center justify-center min-h-screen">
            <form className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="mb-4">
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
                    <button type="submit" onClick={loginHandler} className="bg-[#144922] text-white p-2 rounded-md mt-2 w-full transform transition duration-200 ease-in-out hover:scale-105 hover:bg-[#62A663] focus:outline-none">Login</button>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-gray-700">Don't have an account? <a href="/register" className="text-[#144922] hover:underline">Register</a></p>
                </div>
            </form>
            
        </div>
    )
}