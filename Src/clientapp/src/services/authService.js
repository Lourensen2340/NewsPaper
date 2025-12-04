export const authService = {
    login: async (credentials) => {
        console.log('🔑 Login attempt:', credentials);

        try {
            // Упрощенный формат данных
            const requestBody = {
                email: credentials.email || credentials.Email || '',
                password: credentials.password || credentials.Password || ''
            };

            console.log('📤 Sending:', requestBody);

            const response = await fetch('https://localhost:7113/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });

            console.log('📥 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);

                // Пробуем разобрать как JSON
                try {
                    const errorJson = JSON.parse(errorText);
                    return {
                        success: false,
                        error: errorJson.error || `Server error: ${response.status}`,
                        details: errorJson
                    };
                } catch {
                    return {
                        success: false,
                        error: `Server error: ${response.status} ${response.statusText}`,
                        details: errorText
                    };
                }
            }

            const data = await response.json();
            console.log('✅ Login response:', data);

            if (data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                return { success: true, data: data };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }

        } catch (error) {
            console.error('💥 Network error:', error);
            return {
                success: false,
                error: 'Network error: ' + error.message
            };
        }
    },

    logout: async () => {
        try {
            localStorage.removeItem('isAuthenticated');
            await fetch('https://localhost:7113/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('isAuthenticated');
        }
    },

    isAuthenticated: () => {
        const auth = localStorage.getItem('isAuthenticated') === 'true';
        console.log('Auth check:', auth);
        return auth;
    }
};