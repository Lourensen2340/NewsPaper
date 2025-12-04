using NewsPaper.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NewsPaper.Services
{
    public interface INewsService
    {
        Task<List<News>> GetLatestNewsAsync(int count, string languageCode = "ru");
        Task<List<News>> GetAllNewsAsync(string languageCode = "ru");
        Task<List<News>> GetAllNewsForAdminAsync(); // Новый метод
        Task<News> GetNewsByIdAsync(int id, string languageCode = "ru");
        Task CreateNewsWithTranslationsAsync(CreateNewsRequest request);
        Task UpdateNewsWithTranslationsAsync(int id, CreateNewsRequest request);
        Task DeleteNewsAsync(int id);
    }
}