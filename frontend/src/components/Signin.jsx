import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CustomAlert from './CustomAlert';

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
      await axios.post('/api/user/signin', { name, email, password });
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
      {msg && <CustomAlert message={msg} onClose={() => setMsg('')} />}
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
      <Stylesheet />
    </>
  );
};

const Stylesheet = () => {
  return <style>{`
                p{
                   color:var(--font-text);
                }
                input{
                    background-color:var(--secondary-color);
                    color:var(--font-text);
                    border:none;
                    font-weight:bold;
                }
               .login{
                   color:var(--font-text);
                   border:2px solid var(--font-text);
                   width:400px;
                   border-radius:10px;
                   display:flex;
                   flex-direction:column;
               }
                .sub-heading-login{
                   color:grey;
                   font-size:15px;
                   display:flex;
                   justify-content:left;
                   padding-left:50px;
                }
                .heading-login{
                   font-weight:bold;
                   font-size:28px;
                   display:flex;
                   justify-content:left;
                   padding-left:50px;
                   margin-bottom:12px;
                }
                .login-container{  
                   height:100vh;             
                   display:flex;
                   align-items:center;
                   justify-content:center;
               }
               .input-box{
                    padding:10px;
                    border-radius:5px;
                    width:70%;
                }
                .email-input,.password-input,.name-input{
                   margin-bottom:20px;
                }
                .remember-box{
                    display:flex;
                    flex-direction:row;
                    gap:5%;
                    align-items:center;
                    margin-bottom:15px;
                    justify-content:center;
                    font-size:15px;
                }
                .signup-button,.login-button{
                    background-color:var(--button-color);
                    color:var(--bg-parchment);
                    width:75%;
                    border:none;
                    margin:10px;
                    border-radius:10px;
                    padding:10px;
                    font-size:1.5rem;
                    font-family: 'January', sans-serif;
                }
                .have-account{
                   cursor:pointer;
                }
            `}</style>
}

export default Signin;
