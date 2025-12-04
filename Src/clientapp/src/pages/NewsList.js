import React, { useState, useEffect } from 'react';
import newsService from '../services/newsService';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedNewsList } from '../utils/newsTranslation';
import NewsCard from '../components/NewsCard';
import LoadingSpiner from '../components/LoadingSpiner';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const { language } = useLanguage();

    const loadNews = async (pageNum = 1) => {
        if (loading) return;

        setLoading(true);
        try {
            console.log(`Загружаем страницу ${pageNum} на языке ${language}`);
            const response = await newsService.getAllNews();

            console.log('Сырые данные от API:', response.data);

            // Применяем перевод
            const translatedNews = getTranslatedNewsList(response.data, language);
            console.log('Переведенные данные:', translatedNews);

            if (pageNum === 1) {
                setNews(translatedNews);
            } else {
                setNews(prev => [...prev, ...translatedNews]);
            }

            if (response.data.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadNews(nextPage);
        }
    };

    useEffect(() => {
        loadNews(1);
        setPage(1);
        setHasMore(true);
    }, [language]); // Добавляем language в зависимости

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {language === 'ru' ? 'Все новости' : 'All News'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {news.map(item => (
                    <NewsCard key={item.id} news={item} />
                ))}
            </div>

            {hasMore && (
                <div className="text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading
                            ? (language === 'ru' ? 'Загрузка...' : 'Loading...')
                            : (language === 'ru' ? 'Загрузить еще' : 'Load More')
                        }
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewsList;