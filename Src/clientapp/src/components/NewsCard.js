import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NewsCard = ({ news }) => {
    const { language } = useLanguage();

    // Безопасное получение изображения
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/placeholder-image.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `https://localhost:7113${imageUrl}`;
    };

    const imageUrl = getImageUrl(news.imageUrl);

    // Обрезаем текст для превью
    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Форматируем дату
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
                src={imageUrl}
                alt={news.title || 'News image'}
                className="w-full h-48 object-cover"
                onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                }}
            />

            <div className="p-6">
                <div className="mb-4">
                    <span className="text-sm text-gray-500">
                        {formatDate(news.createdDate)}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {news.title || (language === 'ru' ? 'Без названия' : 'No title')}
                </h3>

                {news.subtitle && (
                    <p className="text-gray-600 mb-4">
                        {news.subtitle}
                    </p>
                )}

                {news.content && (
                    <p className="text-gray-700 mb-6">
                        {truncateText(news.content)}
                    </p>
                )}

                <div className="mt-4">
                    <Link
                        to={`/news/${news.id}`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        {language === 'ru' ? 'Читать далее' : 'Read more'} →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;