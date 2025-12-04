import axios from 'axios';

// Базовый URL для API - используем относительный путь при работе через nginx
const API_URL = process.env.NODE_ENV === 'production'
    ? '/api/news'  // В production через nginx прокси
    : 'https://localhost:7113/api/news';  // В development напрямую

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const newsService = {
    getAllNews: () => {
        return apiClient.get('/');
    },

    getLatestNews: (count = 5, language = 'ru') => {
        return apiClient.get(`/latest?count=${count}&language=${language}`);
    },

    getNewsById: (id) => {
        return apiClient.get(`/${id}`);
    },

    createNews: (newsData) => {
        return apiClient.post('/', newsData);
    },

    updateNews: (id, newsData) => {
        return apiClient.put(`/${id}`, newsData);
    },

    deleteNews: (id) => {
        return apiClient.delete(`/${id}`);
    }
};

export default newsService;