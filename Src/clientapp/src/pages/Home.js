import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../services/newsService';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedNewsList } from '../utils/newsTranslation';
import NewsCard from '../components/NewsCard';
import LoadingSpiner from '../components/LoadingSpiner';

const Home = () => {
    const [latestNews, setLatestNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { language } = useLanguage();

    useEffect(() => {
        const fetchLatestNews = async () => {
            try {
                setLoading(true);
                console.log(`Запрашиваем последние новости, текущий язык: ${language}`);

                // ✅ Получаем новости без параметра языка (сервер сам решает, какие новости отдавать)
                const response = await newsService.getLatestNews(5);
                console.log('Сырые данные от API:', response.data);

                // ✅ Применяем перевод на клиенте
                const processedNews = getTranslatedNewsList(response.data, language);
                console.log('Переведенные новости:', processedNews);

                setLatestNews(processedNews);
            } catch (error) {
                console.error('Error loading news:', error);
                setError(language === 'ru' ? 'Ошибка загрузки новостей' : 'Failed to load news');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestNews();
    }, [language]); // ✅ Зависимость от language - перезагружаем при смене языка

    if (loading) return <LoadingSpiner />;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {language === 'ru' ? 'Последние новости' : 'Latest News'}
            </h1>

            {latestNews.length === 0 ? (
                <div className="text-center text-gray-500">
                    {language === 'ru' ? 'Новости не найдены' : 'No news found'}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {latestNews.map(news => (
                            <NewsCard key={news.id} news={news} />
                        ))}
                    </div>

                    <div className="text-center">
                        <Link
                            to="/news"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {language === 'ru' ? 'Все новости' : 'All News'}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;