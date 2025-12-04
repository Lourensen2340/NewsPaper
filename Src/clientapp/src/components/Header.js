import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { language } = useLanguage();

    const translations = {
        ru: {
            home: 'Главная',
            news: 'Новости',
            admin: 'Админка',
            logout: 'Выйти',
            login: 'Войти',
            welcome: 'Добро пожаловать',
            newsPortal: 'NewsPaper'
        },
        en: {
            home: 'Home',
            news: 'News',
            admin: 'Admin',
            logout: 'Logout',
            login: 'Login',
            welcome: 'Welcome',
            newsPortal: 'NewsPaper'
        }
    };

    const t = translations[language];

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            {t.newsPortal}
                        </Link>
                        <nav className="flex space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                                {t.home}
                            </Link>
                            <Link to="/news" className="text-gray-600 hover:text-blue-600 transition-colors">
                                {t.news}
                            </Link>
                            {isAuthenticated && (
                                <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    {t.admin}
                                </Link>
                            )}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {user && (
                                    <span className="text-sm text-gray-600">
                                        {t.welcome}, <span className="font-medium">{user.name || user.email}</span>
                                    </span>
                                )}
                                <button
                                    onClick={logout}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                >
                                    {t.logout}
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                {t.login}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;