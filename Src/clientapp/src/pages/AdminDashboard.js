import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import newsService from '../services/newsService'; // ✅ Исправлен импорт
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedNewsList } from '../utils/newsTranslation';
import LoadingSpiner from '../components/LoadingSpiner';
// ❌ UrlScraper удален

const AdminDashboard = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();

    // ✅ Функция для получения переведенного заголовка новости
    const getTranslatedTitle = (newsItem) => {
        if (!newsItem) return '';

        // Если есть отдельные поля для языков
        if (newsItem.titleRu !== undefined) {
            return language === 'ru' ? newsItem.titleRu : newsItem.titleEn;
        }

        // Если есть массив translations
        if (newsItem.translations && newsItem.translations.length > 0) {
            const translation = newsItem.translations.find(t =>
                t.language?.code === language ||
                t.languageId === (language === 'en' ? 2 : 1)
            ) || newsItem.translations[0];

            return translation?.title || newsItem.title || '';
        }

        // Простая структура с прямыми полями
        if (language === 'en' && newsItem.titleEn) {
            return newsItem.titleEn;
        }

        return newsItem.title || '';
    };

    // ✅ Загрузка новостей
    useEffect(() => {
        if (isAuthenticated) {
            const fetchNews = async () => {
                try {
                    const response = await newsService.getAllNews();
                    setNews(response.data);
                } catch (error) {
                    console.error('Error loading news:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchNews();
        }
    }, [isAuthenticated]);

    // ✅ Функция удаления новости
    const handleDelete = async (id) => {
        if (window.confirm(
            language === 'ru'
                ? 'Вы уверены, что хотите удалить эту новость?'
                : 'Are you sure you want to delete this news?'
        )) {
            try {
                await newsService.deleteNews(id);
                setNews(news.filter(item => item.id !== id));
            } catch (error) {
                console.error('Error deleting news:', error);
                alert(
                    language === 'ru'
                        ? 'Ошибка при удалении новости'
                        : 'Error deleting news'
                );
            }
        }
    };

    // ✅ Переводы для интерфейса
    const translations = {
        ru: {
            title: 'Панель администратора',
            create: 'Создать новость',
            titleHeader: 'Заголовок',
            date: 'Дата',
            actions: 'Действия',
            edit: 'Редактировать',
            delete: 'Удалить',
            noNews: 'Новостей нет',
            view: 'Просмотр'
        },
        en: {
            title: 'Admin Panel',
            create: 'Create News',
            titleHeader: 'Title',
            date: 'Date',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            noNews: 'No news',
            view: 'View'
        }
    };

    const t = translations[language];

    if (!isAuthenticated) {
        return (
            <div className="text-center mt-8">
                {language === 'ru' ? 'Доступ запрещен' : 'Access denied'}
            </div>
        );
    }

    if (loading) return <LoadingSpiner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
                <Link
                    to="/admin/news/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {t.create}
                </Link>
            </div>

            {news.length === 0 ? (
                <p className="text-gray-500 text-center">{t.noNews}</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.titleHeader}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.date}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t.actions}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {news.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {/* ✅ Используем функцию для получения переведенного заголовка */}
                                            {getTranslatedTitle(item)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(item.createdDate).toLocaleDateString(
                                                language === 'ru' ? 'ru-RU' : 'en-US'
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {/* ✅ Ссылка на просмотр */}
                                        <a
                                            href={`/news/${item.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            {t.view}
                                        </a>
                                        {/* Link for edit */}
                                        <Link
                                            to={`/admin/news/edit/${item.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            {t.edit}
                                        </Link>
                                        {/* Button Delete */}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            {t.delete}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;