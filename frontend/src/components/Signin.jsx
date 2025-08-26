import React, { lazy,Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css'
import API from '../api'

const CustomAlert = lazy(() => import('./CustomAlert'));

const Signin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignin() {
    if (loading) return;
    setLoading(true);

    if (!email || !password || !confirmPassword || !name) {
      setMsg('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMsg('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMsg('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMsg('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      await API.post('/api/user/signin', { name, email, password });
      navigate('/login');
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Signup failed.';
        if (status === 409) {
          setMsg('Email already exists. Please use a different email.');
        } else {
          setMsg(message);
        }
      } else {
        setMsg('Something went wrong. Please try again.');
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
          <div className="heading-login">Create your account</div>
          <div className="name-input">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="input-box"
            />
          </div>
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
          <div className="password-input">
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm Password"
              className="input-box"
            />
          </div>
          <div>
            <button className="signup-button" disabled={loading} onClick={handleSignin}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
          <div>
            <p className="have-account">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;
