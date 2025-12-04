const testLoginDetailed = async () => {
    console.log('🔍 Starting detailed test...');

    try {
        // Тестовый запрос
        const response = await fetch('https://localhost:7113/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@news.com',
                password: 'admin123'
            }),
            credentials: 'include'
        });

        console.log('📊 Response Status:', response.status, response.statusText);

        // Показываем все заголовки
        console.log('📋 Response Headers:');
        const headers = {};
        for (const [key, value] of response.headers.entries()) {
            headers[key] = value;
        }
        console.table(headers);

        // Получаем текст ответа
        const responseText = await response.text();
        console.log('📝 Response Text:', responseText);

        // Пробуем разобрать JSON
        let parsedData;
        try {
            parsedData = JSON.parse(responseText);
            console.log('✅ Parsed JSON successfully:');
            console.dir(parsedData);

            // Если есть success, проверяем его
            if (parsedData.success !== undefined) {
                console.log(`🎯 Success: ${parsedData.success}`);
            }
        } catch (e) {
            console.log('❌ Could not parse JSON:', e.message);
        }

        return parsedData || responseText;

    } catch (error) {
        console.error('💥 Error:', error);
        return { error: error.message };
    }
};