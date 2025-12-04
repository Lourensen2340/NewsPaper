import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Проверяем наличие токена в localStorage при загрузке
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // ВРЕМЕННО: Для разработки, принимаем любой email и password
            // В реальном приложении здесь должен быть вызов API

            // ✅ ТЕСТОВЫЙ ЛОГИН (для разработки)
            if (email && password) {
                const userData = {
                    email: email,
                    name: 'Admin User',
                    role: 'admin'
                };

                localStorage.setItem('authToken', 'dev-token-' + Date.now());
                localStorage.setItem('userData', JSON.stringify(userData));

                setIsAuthenticated(true);
                setUser(userData);

                console.log('✅ Login successful (dev mode):', email);
                return;
            }

            throw new Error('Email and password required');

            // ✅ РЕАЛЬНЫЙ API ВЫЗОВ (когда бэкенд готов)
            /*
            const response = await fetch('https://localhost:7113/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            setIsAuthenticated(true);
            setUser(data.user);
            */

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};