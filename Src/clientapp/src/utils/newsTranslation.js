// ✅ Простая функция перевода новостей
export const getTranslatedNews = (newsItem, language) => {
    if (!newsItem) return null;

    // Если у новости есть отдельные поля для языков
    if (newsItem.titleRu !== undefined || newsItem.titleEn !== undefined) {
        return {
            ...newsItem,
            title: language === 'ru' ? (newsItem.titleRu || newsItem.title) : (newsItem.titleEn || newsItem.title),
            subtitle: language === 'ru' ? (newsItem.subtitleRu || newsItem.subtitle) : (newsItem.subtitleEn || newsItem.subtitle),
            content: language === 'ru' ? (newsItem.contentRu || newsItem.content) : (newsItem.contentEn || newsItem.content)
        };
    }

    // Если у новости есть массив translations
    if (newsItem.translations && Array.isArray(newsItem.translations)) {
        const translation = newsItem.translations.find(t =>
            t.language?.code === language ||
            t.language?.toLowerCase() === language ||
            (t.languageId && (
                (language === 'ru' && t.languageId === 1) ||
                (language === 'en' && t.languageId === 2)
            ))
        ) || newsItem.translations[0];

        if (translation) {
            return {
                ...newsItem,
                title: translation.title || newsItem.title,
                subtitle: translation.subtitle || newsItem.subtitle,
                content: translation.content || newsItem.content
            };
        }
    }

    // Если нет перевода, возвращаем оригинал
    return newsItem;
};

export const getTranslatedNewsList = (newsList, language) => {
    if (!Array.isArray(newsList)) return [];
    return newsList.map(item => getTranslatedNews(item, language));
};