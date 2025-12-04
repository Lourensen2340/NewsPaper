export const generateCurlCommand = (newsData, imageFile = null) => {
    const baseUrl = 'https://localhost:7113';

    if (imageFile) {
        // Для загрузки изображения
        return `curl -X POST "${baseUrl}/api/scraper/upload-image" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@${imageFile.name}" \\
  -H "Cookie: admin_auth=true"`;
    } else {
        // Для создания новости
        const jsonData = JSON.stringify(newsData, null, 2);
        return `curl -X POST "${baseUrl}/api/scraper/upload-news" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_auth=true" \\
  -d '${jsonData}'`;
    }
};