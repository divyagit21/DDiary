import React, { lazy,Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css'
import API from '../api'

const CustomAlert = lazy(() => import('./CustomAlert'));

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const { login } = useAuth();

    async function handleLogin() {
        if (loading) return;
        setLoading(true);
        try {
            if (!email || !password) {
                setMsg('Please fill in all fields.');
                setLoading(false);
                return;
            }
            setMsg('');
            const res = await API.post('/api/user/login', { email, password });
            await login();
            navigate('/home');
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || 'Login failed.';
                if (status === 401) {
                    setMsg('Incorrect password. Please try again.');
                    return;
                } else if (status === 404) {
                    setMsg('User does not exist. Please sign up.');
                    return
                } else {
                    setMsg(message);
                    return
                }
            } else {
                setMsg('Something went wrong. Please try again.');
                return
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
            </Suspense>
            <div className="login-container">
                <div className="login">
                    <div className="sub-heading-login">
                        <p>Please enter your details</p>
                    </div>
                    <div className="heading-login">Welcome back</div>
                    <div className="email-input">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email address"
                            className="input-box"
                        />
                    </div>
                    <div className="password-input">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                            className="input-box"
                        />
                    </div>
                    <div>
                        <button className="login-button" onClick={handleLogin} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    <div>
                        <p className="have-account">
                            Don't have an account? <Link to="/signin">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
