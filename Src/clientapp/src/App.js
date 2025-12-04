import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

// Тестируем компоненты по одному
 import Header from './components/Header';
 import Home from './pages/Home';
 import NewsList from './pages/NewsList';
 import NewsDetail from './pages/NewsDetail';
 import AdminLogin from './pages/AdminLogin';
 import AdminDashboard from './pages/AdminDashboard';
import NewsForm from './pages/NewsForm';
import { useEffect } from 'react';

function App() {
        useEffect(() => {
            // Динамически добавляем favicon
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = '/favicon.ico?v=' + new Date().getTime();
            document.head.appendChild(link);
        }, []);
    return (
        <LanguageProvider>
            <AuthProvider>
                <Router>
                    <div className="App min-h-screen bg-gray-50">
                         <Header /> 
                        <main>
                            <Routes>
                                 <Route path="/" element={<Home />} />
                                <Route path="/news" element={<NewsList />} />
                                <Route path="/news/:id" element={<NewsDetail />} />
                                <Route path="/admin/login" element={<AdminLogin />} />
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/news/create" element={<NewsForm />} />
                                <Route path="/admin/news/edit/:id" element={<NewsForm />} /> 
                            </Routes>
                        </main>
                    </div>
                </Router>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;