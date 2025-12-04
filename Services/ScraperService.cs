using Microsoft.AspNetCore.Hosting;
using NewsPaper.Models;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NewsPaper.Services
{
    public class ScraperService : IScraperService
    {
        private readonly INewsService _newsService;
        private readonly IWebHostEnvironment _environment;

        public ScraperService(INewsService newsService, IWebHostEnvironment environment)
        {
            _newsService = newsService;
            _environment = environment;
        }

        public async Task<NewsItem> ScrapeAndCreateNewsAsync(NewsUploadRequest request)
        {
            try
            {
                var createRequest = new CreateNewsRequest
                {
                    ImageUrl = request.ImageUrl,
                    IsPublished = request.IsPublished,
                    TitleRu = request.TitleRu,
                    SubtitleRu = request.SubtitleRu,
                    ContentRu = request.ContentRu,
                    TitleEn = request.TitleEn,
                    SubtitleEn = request.SubtitleEn,
                    ContentEn = request.ContentEn
                };

                await _newsService.CreateNewsWithTranslationsAsync(createRequest);

                return new NewsItem { Success = true, Message = "News created successfully" };
            }
            catch (Exception ex)
            {
                return new NewsItem { Success = false, Message = ex.Message };
            }
        }

        public async Task<string> UploadImageAsync(Stream imageStream, string fileName)
        {
            var uploadsPath = Path.Combine(_environment.WebRootPath, "images");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var extension = Path.GetExtension(fileName);
            var newFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, newFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await imageStream.CopyToAsync(fileStream);
            }

            return $"/images/{newFileName}";
        }
    }
}