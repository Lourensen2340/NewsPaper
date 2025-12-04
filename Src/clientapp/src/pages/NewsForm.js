import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import newsService from '../services/newsService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpiner from '../components/LoadingSpiner';

const NewsForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage();

    const [formData, setFormData] = useState({
        imageUrl: '',
        isPublished: true,
        titleRu: '',
        subtitleRu: '',
        contentRu: '',
        titleEn: '',
        subtitleEn: '',
        contentEn: ''
    });

    const [validationErrors, setValidationErrors] = useState({
        titleRu: '',
        contentRu: '',
        titleEn: '',
        contentEn: '',
        general: ''
    });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    // Загрузка новости для редактирования
    useEffect(() => {
        if (isEdit) {
            const fetchNews = async () => {
                setInitialLoading(true);
                try {
                    const response = await newsService.getNewsById(id);
                    const newsItem = response.data;

                    setFormData({
                        imageUrl: newsItem.imageUrl || '',
                        isPublished: newsItem.isPublished !== false,
                        titleRu: newsItem.titleRu || newsItem.title || '',
                        subtitleRu: newsItem.subtitleRu || newsItem.subtitle || '',
                        contentRu: newsItem.contentRu || newsItem.content || '',
                        titleEn: newsItem.titleEn || newsItem.title || '',
                        subtitleEn: newsItem.subtitleEn || newsItem.subtitle || '',
                        contentEn: newsItem.contentEn || newsItem.content || ''
                    });
                } catch (error) {
                    console.error('Error loading news:', error);
                    setValidationErrors(prev => ({
                        ...prev,
                        general: language === 'ru'
                            ? 'Ошибка загрузки новости'
                            : 'Error loading news'
                    }));
                } finally {
                    setInitialLoading(false);
                }
            };

            fetchNews();
        }
    }, [id, isEdit, language]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Очищаем ошибку для этого поля
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Проверка русской версии
        if (!formData.titleRu.trim()) {
            errors.titleRu = language === 'ru' ? 'Введите заголовок' : 'Enter title';
            isValid = false;
        }

        if (!formData.contentRu.trim()) {
            errors.contentRu = language === 'ru' ? 'Введите содержание' : 'Enter content';
            isValid = false;
        }

        // Проверка английской версии
        if (!formData.titleEn.trim()) {
            errors.titleEn = language === 'ru' ? 'Введите заголовок (англ.)' : 'Enter title (English)';
            isValid = false;
        }

        if (!formData.contentEn.trim()) {
            errors.contentEn = language === 'ru' ? 'Введите содержание (англ.)' : 'Enter content (English)';
            isValid = false;
        }

        setValidationErrors(prev => ({ ...prev, ...errors }));
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors(prev => ({ ...prev, general: '' }));

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const newsData = {
                imageUrl: formData.imageUrl,
                isPublished: formData.isPublished,
                titleRu: formData.titleRu.trim(),
                subtitleRu: formData.subtitleRu.trim(),
                contentRu: formData.contentRu.trim(),
                titleEn: formData.titleEn.trim(),
                subtitleEn: formData.subtitleEn.trim(),
                contentEn: formData.contentEn.trim()
            };

            if (isEdit) {
                await newsService.updateNews(id, newsData);
            } else {
                await newsService.createNews(newsData);
            }

            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 500);

        } catch (error) {
            console.error('Error saving:', error);
            let errorMessage = language === 'ru'
                ? 'Ошибка сохранения'
                : 'Error saving';

            if (error.response) {
                if (error.response.data && error.response.data.errors) {
                    const serverErrors = error.response.data.errors;
                    const newErrors = {};

                    Object.keys(serverErrors).forEach(key => {
                        const fieldName = key.toLowerCase();
                        newErrors[fieldName] = serverErrors[key][0];
                    });

                    setValidationErrors(prev => ({
                        ...prev,
                        ...newErrors,
                        general: language === 'ru'
                            ? 'Проверьте правильность заполнения полей'
                            : 'Please check the form fields'
                    }));
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }

            setValidationErrors(prev => ({
                ...prev,
                general: errorMessage
            }));
        } finally {
            setLoading(false);
        }
    };

    const translations = {
        ru: {
            titleCreate: 'Создание новости',
            titleEdit: 'Редактирование новости',
            imageUrl: 'URL изображения',
            isPublished: 'Опубликовано',
            russian: 'Русская версия',
            english: 'Английская версия',
            title: 'Заголовок',
            subtitle: 'Подзаголовок',
            content: 'Содержание',
            save: 'Сохранить',
            cancel: 'Отмена',
            loading: 'Сохранение...'
        },
        en: {
            titleCreate: 'Create News',
            titleEdit: 'Edit News',
            imageUrl: 'Image URL',
            isPublished: 'Published',
            russian: 'Russian version',
            english: 'English version',
            title: 'Title',
            subtitle: 'Subtitle',
            content: 'Content',
            save: 'Save',
            cancel: 'Cancel',
            loading: 'Saving...'
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

    if (initialLoading) return <LoadingSpiner />;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {isEdit ? t.titleEdit : t.titleCreate}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Общие поля */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {language === 'ru' ? 'Общие настройки' : 'General Settings'}
                    </h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {t.imageUrl}
                        </label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            id="isPublished"
                            className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="isPublished" className="ml-2 text-gray-700">
                            {t.isPublished}
                        </label>
                    </div>
                </div>

                {/* Русская версия */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {t.russian}
                    </h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {t.title} *
                        </label>
                        <input
                            type="text"
                            name="titleRu"
                            value={formData.titleRu}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.titleRu ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {validationErrors.titleRu && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.titleRu}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {t.subtitle}
                        </label>
                        <input
                            type="text"
                            name="subtitleRu"
                            value={formData.subtitleRu}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {t.content} *
                        </label>
                        <textarea
                            name="contentRu"
                            value={formData.contentRu}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.contentRu ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {validationErrors.contentRu && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.contentRu}</p>
                        )}
                    </div>
                </div>

                {/* Английская версия */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {t.english}
                    </h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {t.title} *
                        </label>
                        <input
                            type="text"
                            name="titleEn"
                            value={formData.titleEn}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.titleEn ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {validationErrors.titleEn && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.titleEn}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {t.subtitle}
                        </label>
                        <input
                            type="text"
                            name="subtitleEn"
                            value={formData.subtitleEn}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {t.content} *
                        </label>
                        <textarea
                            name="contentEn"
                            value={formData.contentEn}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.contentEn ? 'border-red-500' : 'border-gray-300'
                                }`}
                            required
                        />
                        {validationErrors.contentEn && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.contentEn}</p>
                        )}
                    </div>
                </div>

                {validationErrors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {validationErrors.general}
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        {t.cancel}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? t.loading : t.save}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewsForm;