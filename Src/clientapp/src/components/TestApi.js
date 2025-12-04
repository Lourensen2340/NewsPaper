import api from './services/api';

export const testAPI = async () => {
    console.log('=== Testing API Connection ===');

    try {
        // Тест базового подключения
        console.log('1. Testing base connection...');
        const testResponse = await api.get('/test');
        console.log('✅ Test endpoint:', testResponse.data);

        // Тест публичных новостей
        console.log('2. Testing public news...');
        const newsResponse = await api.get('/public/news/latest?count=1&language=ru');
        console.log('✅ Public news:', newsResponse.data);

        // Тест логина
        console.log('3. Testing login...');
        const loginResponse = await api.post('/admin/login', {
            email: 'admin@news.com',
            password: 'admin123'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('✅ Login:', loginResponse.data);

        return true;
    } catch (error) {
        console.error('❌ API test failed:');
        console.error('URL:', error.config?.url);
        console.error('Method:', error.config?.method);
        console.error('Data:', error.config?.data);
        console.error('Status:', error.response?.status);
        console.error('Response:', error.response?.data);
        return false;
    }
};