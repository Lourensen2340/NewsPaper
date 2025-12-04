import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import newsService from '../services/newsService'; // ✅ Исправлен импорт
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedNews } from '../utils/newsTranslation';
import LoadingSpiner from '../components/LoadingSpiner';

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { language } = useLanguage();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await newsService.getNewsById(id);
                setNews(response.data);
            } catch (error) {
                console.error('Error loading news:', error);
                setError('News not found');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

    // Получаем переведенную новость при изменении языка
    const translatedNews = news ? getTranslatedNews(news, language) : null;

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/placeholder-image.jpg';
        if (imageUrl.startsWith('http')) return imageUrl;
        return `https://localhost:7113${imageUrl}`;
    };

    const imageUrl = translatedNews ? getImageUrl(translatedNews.imageUrl) : '';

    if (loading) return <LoadingSpiner />;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
    if (!translatedNews) return <div className="text-center mt-8">News not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={translatedNews.title}
                    className="w-full h-64 md:h-96 object-cover"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                    }}
                />

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        {translatedNews.title}
                    </h1>

                    {translatedNews.subtitle && (
                        <h2 className="text-xl text-gray-600 mb-6">
                            {translatedNews.subtitle}
                        </h2>
                    )}

                    <div
                        className="prose prose-lg max-w-none text-gray-700 mb-8"
                        dangerouslySetInnerHTML={{
                            __html: translatedNews.content?.replace(/\n/g, '<br/>') || ''
                        }}
                    />

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-500 text-sm">
                            {language === 'ru' ? 'Опубликовано' : 'Published'} {new Date(translatedNews.createdDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default NewsDetail;