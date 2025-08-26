import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../api'
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: null
    });
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 && auth.isAuthenticated) {
                    setAuth({ isAuthenticated: false, user: null });
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );
        return () => API.interceptors.response.eject(interceptor);
    }, [auth.isAuthenticated, navigate]);

    useEffect(() => {
        login();
    }, []);

    const login = async () => {
        try {
            const res = await API.get('/api/user/profile');
            setAuth({
                isAuthenticated: true,
                user: res.data.user
            });
        } catch {
            setAuth({
                isAuthenticated: false,
                user: null
            });
        }
        finally {
            setLoading(false);
        }
    };
    const logout = async () => {
        await API.post('/api/user/logout', {});
        setAuth({ isAuthenticated: false, user: null });
    };

    return <AuthContext.Provider value={{ ...auth, setAuth, login, logout,loading }}>
        {children}
    </AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext);