import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        return () => axios.interceptors.response.eject(interceptor);
    }, [auth.isAuthenticated, navigate]);

    useEffect(() => {
        login();
    }, []);

    const login = async () => {
        try {
            const res = await axios.get('/api/user/profile', {
                withCredentials: true
            });
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
        await axios.post('/api/user/logout', {}, {
            withCredentials: true
        });
        setAuth({ isAuthenticated: false, user: null });
    };

    return <AuthContext.Provider value={{ ...auth, setAuth, login, logout,loading }}>
        {children}
    </AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext);