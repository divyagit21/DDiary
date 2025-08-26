import React, { lazy,Suspense, useState } from 'react';
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext';
import './Home.css'
const ConfirmationAlert = lazy(() => import('./ConfirmationAlert'));
const Home = () => {
    const navigate = useNavigate();
    const [logoutClicked, setLogoutClicked] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
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
            <Suspense fallback={<div>Loading...</div>}>
                {isOpen && (
                    <ConfirmationAlert
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onConfirm={confirmAlert}
                        message="Are you sure you want to logout?"
                        type="Logout"
                    />
                )}
            </Suspense>
            <div className='container'>
                <div className='main-heading'>
                    <div>Welcome to your world—where</div>
                    <div>its just you and your thoughts.</div>
                </div>
                <div className='main-menu'>
                    <Link to="/journal"><div className='menu-box'>Journal</div>
                    </Link>
                    <Link className='menu-box' to="/history"><div className='menu-box'>Journal History</div>
                    </Link>
                    <Link className='menu-box' to="/tasks"><div className='menu-box'>Tasks</div>
                    </Link>
                    <Link className='menu-box' to="/tracker"><div className='menu-box'>Mood Tracker</div>
                    </Link>
                    <Link className='menu-box' to="/trackerHistory"><div className='menu-box'>Mood Tracker History</div>
                    </Link>
                    <Link className='menu-box' to="/dashboard"><div className='menu-box'>DashBoard</div>
                    </Link>
                    <button className='menu-box' onClick={handleLogout}><div className='menu-box'>Logout</div></button>
                </div>
                <div className='design-layout'>
                    <img className='design' src='/assets/background1.png' alt="Design" />
                </div>
            </div>
        </>
    );
};

export default Home;
