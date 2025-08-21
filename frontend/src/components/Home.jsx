import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ConfirmationAlert from './ConfirmationAlert'
import { useAuth } from './AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const [logoutClicked, setLogoutClicked] = useState(false);
    const [isOpen,setIsOpen]=useState(false)
    const { logout } = useAuth();

    const handleLogout = () => {
        setLogoutClicked(true);
        setIsOpen(true);
    }
    const confirmAlert = () => {
        if (logoutClicked) {
            logout();
        }
    }
    return (
        <>
            <ConfirmationAlert isOpen={isOpen} onClose={() => { setIsOpen(false); }} onConfirm={confirmAlert} message={"Are you sure you want to logout?"} type={"Logout"} />
            <div className='container'>
                <div className='main-heading'>
                    <div>Welcome to your world—where</div>
                    <div>its just you and your thoughts.</div>
                </div>
                <div className='main-menu'>
                    <Link to="/journal"><div className='menu-box'>Journal</div>
                    </Link>
                    <Link className='menu-box' to="/tasks"><div className='menu-box'>Tasks</div>
                    </Link>
                    <Link className='menu-box' to="/history"><div className='menu-box'>History</div>
                    </Link>
                    <Link className='menu-box' to="/dashboard"><div className='menu-box'>DashBoard</div>
                    </Link>
                    <button className='menu-box' onClick={handleLogout}><div className='menu-box'>Logout</div></button>

                </div>

                <div className='design-layout'>
                    <img className='design' src='/assets/background1.png' alt="Design" />
                </div>
            </div>
            <Stylesheet />
        </>
    );
};

const Stylesheet = () => {
    return <style>{`
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            min-height: 100vh;
            padding: 2rem;
            box-sizing: border-box;
        }

        .main-heading {
            font-size: 2rem;
            text-align: center;
            margin-top: 2rem;
        }
        .main-menu {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5rem;
            margin: 3rem 0;
        }

        .menu-box {
            background-color: var(--secondary-color);
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            font-size: 1.3rem;
            transition: all 0.3s ease-in-out;
            border:none;
        }

        button.menu-box {
            background-color: var(--secondary-color);  
            color: var(--text);
            cursor: pointer;    
            font-size: 1rem;
            font-family: 'Cedarville Cursive', cursive;
        }

        .menu-box:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .design-layout {
            display: flex;
            justify-content: center;
            margin: 2rem 0;
            width: 100%;
        }

        .design {
            width: 80%;
            max-width: 700px;
            height: auto;
            opacity: 0.8;
        }

        @media (max-width: 768px) {
            .main-heading {
                font-size: 1.3rem;
            }

            .menu-box {
                width: 90px;
                height:90px;
                font-size: 0.9rem;
            }
        }

        @media (max-width: 480px) {
            .main-heading {
                font-size: 1.3rem;
            }

            .menu-box {
                width: 100px;
                height: 100px;
                font-size: 1rem;
            }
        }
    `}</style>;
};

export default Home;
