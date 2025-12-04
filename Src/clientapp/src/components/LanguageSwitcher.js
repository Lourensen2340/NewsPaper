import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();

    // Показываем противоположный язык на кнопке
    const displayLanguage = language === 'ru' ? 'EN' : 'RU';
    // Текст для подсказки (tooltip)
    const tooltipText = language === 'ru'
        ? 'Switch to English'
        : 'Переключить на русский';

    return (
        <button
            onClick={toggleLanguage}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            title={tooltipText}
        >
            <span className="font-medium">
                {displayLanguage}
            </span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    );
};

export default LanguageSwitcher;