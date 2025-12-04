import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { language } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Проверка валидности ввода
            if (!email.trim()) {
                throw new Error(language === 'ru' ? 'Введите email' : 'Enter email');
            }

            if (!password.trim()) {
                throw new Error(language === 'ru' ? 'Введите пароль' : 'Enter password');
            }

            await login(email, password);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(
                error.message === 'Invalid credentials' || error.message === 'Email and password required'
                    ? (language === 'ru'
                        ? 'Неверный email или пароль'
                        : 'Invalid email or password')
                    : error.message
            );
        } finally {
            setLoading(false);
        }
    };

    // Для тестирования - автозаполнение тестовых данных
    const fillTestCredentials = () => {
        setEmail('admin@example.com');
        setPassword('password123');
    };

    const translations = {
        ru: {
            title: 'Вход в панель администратора',
            email: 'Email',
            password: 'Пароль',
            login: 'Войти',
            loading: 'Загрузка...',
            testLogin: 'Использовать тестовые данные',
            testNote: 'Для разработки: любой email и пароль'
        },
        en: {
            title: 'Admin Login',
            email: 'Email',
            password: 'Password',
            login: 'Login',
            loading: 'Loading...',
            testLogin: 'Use test credentials',
            testNote: 'For development: any email and password'
        }
    };

    const t = translations[language];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {t.title}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {t.testNote}
                    </p>
                </div>

                {/* Кнопка для заполнения тестовых данных */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={fillTestCredentials}
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >
                        {t.testLogin}
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                {t.email}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder={t.email}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                {t.password}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder={t.password}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t.loading}
                                </span>
                            ) : t.login}
                        </button>
                    </div>

                    {/* Подсказка для разработки */}
                    <div className="text-center text-xs text-gray-500">
                        <p>Для разработки: введите любой email и пароль</p>
                        <p className="mt-1">Например: test@test.com / password</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;