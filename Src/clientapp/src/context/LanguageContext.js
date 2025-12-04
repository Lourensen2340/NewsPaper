import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ru');

    useEffect(() => {
        // Загружаем язык из localStorage при инициализации
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'en')) {
            setLanguage(savedLanguage);
        }
    }, []);

    // ✅ ИСПРАВЛЕНО: Только локальное изменение языка, без запросов на сервер
    const changeLanguage = (lang) => {
        if (lang !== language && (lang === 'ru' || lang === 'en')) {
            setLanguage(lang);
            localStorage.setItem('language', lang);
        }
    };

    // ✅ ИСПРАВЛЕНО: Простое переключение языка
    const toggleLanguage = () => {
        const newLang = language === 'ru' ? 'en' : 'ru';
        changeLanguage(newLang);
    };

    const value = {
        language,
        changeLanguage,
        toggleLanguage
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};