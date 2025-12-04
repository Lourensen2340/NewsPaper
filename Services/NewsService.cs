using Microsoft.EntityFrameworkCore;
using NewsPaper.Data;
using NewsPaper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NewsPaper.Services
{
    public class NewsService : INewsService
    {
        private readonly ApplicationDbContext _context;

        public NewsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateNewsWithTranslationsAsync(CreateNewsRequest request)
        {
            var news = new News
            {
                Title = request.TitleRu,
                Subtitle = request.SubtitleRu,
                Content = request.ContentRu,
                TitleEn = request.TitleEn,
                SubtitleEn = request.SubtitleEn,
                ContentEn = request.ContentEn,
                ImageUrl = request.ImageUrl,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                IsPublished = request.IsPublished
            };

            _context.News.Add(news);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateNewsWithTranslationsAsync(int id, CreateNewsRequest request)
        {
            var news = await _context.News.FindAsync(id);
            if (news == null)
                throw new Exception("News not found");

            news.Title = request.TitleRu;
            news.Subtitle = request.SubtitleRu;
            news.Content = request.ContentRu;
            news.TitleEn = request.TitleEn;
            news.SubtitleEn = request.SubtitleEn;
            news.ContentEn = request.ContentEn;
            news.ImageUrl = request.ImageUrl;
            news.UpdatedDate = DateTime.UtcNow;
            news.IsPublished = request.IsPublished;

            await _context.SaveChangesAsync();
        }

        public async Task<List<News>> GetLatestNewsAsync(int count, string languageCode = "ru")
        {
            var query = _context.News
                .Where(n => n.IsPublished)
                .OrderByDescending(n => n.CreatedDate)
                .Take(count);

            return await query.ToListAsync();
        }

        public async Task<List<News>> GetAllNewsAsync(string languageCode = "ru")
        {
            return await _context.News
                .Where(n => n.IsPublished)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        // Добавьте этот метод
        public async Task<List<News>> GetAllNewsForAdminAsync()
        {
            return await _context.News
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        public async Task<News> GetNewsByIdAsync(int id, string languageCode = "ru")
        {
            return await _context.News
                .Where(n => n.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task DeleteNewsAsync(int id)
        {
            var news = await _context.News.FindAsync(id);
            if (news != null)
            {
                _context.News.Remove(news);
                await _context.SaveChangesAsync();
            }
        }
    }
}