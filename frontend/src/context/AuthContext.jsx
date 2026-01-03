import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to decode JWT without library
    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to decode token', e);
            return null;
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            // 1. Optimistic Load: Decode local token first
            const localUser = decodeToken(token);

            if (localUser) {
                // Ensure we respect expiry locally too
                if (localUser.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Set user from token immediately so UI works
                setUser({
                    id: localUser.id,
                    email: localUser.email,
                    role: localUser.role || 'admin',
                    username: 'Admin', // Fallback until API returns real name
                    status: 'active'
                });
            }

            // 2. Verify with Backend (Background check)
            try {
                const response = await api.get('/auth/me');
                if (response.data.success) {
                    setUser(response.data.data); // Update with fresh data from DB
                }
            } catch (error) {
                console.warn('Backend verify failed, using local token state:', error.message);

                // CRITICAL FIX: Only logout if explicitly unauthorized (401)
                // Do NOT logout on 500, 503, or Network Error
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                const responseData = response.data.data || response.data;
                const authToken = responseData.token;
                const authUser = responseData.user;

                if (!authToken || !authUser) {
                    toast.error('Server returned invalid data');
                    return false;
                }

                localStorage.setItem('token', authToken);
                setUser(authUser);
                toast.success(`Welcome back, ${authUser.username}!`);
                return true;
            }
        } catch (error) {
            console.error('Login Error:', error);
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.info('Logged out successfully');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'super_admin' || user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
