using System.IO;
using System.Threading.Tasks;

namespace NewsPaper.Services
{
    public interface IScraperService
    {
        Task<NewsItem> ScrapeAndCreateNewsAsync(NewsUploadRequest request);
        Task<string> UploadImageAsync(Stream imageStream, string fileName);
    }

    public class NewsUploadRequest
    {
        public string ImageUrl { get; set; }
        public bool IsPublished { get; set; } = true;
        public string TitleRu { get; set; }
        public string SubtitleRu { get; set; }
        public string ContentRu { get; set; }
        public string TitleEn { get; set; }
        public string SubtitleEn { get; set; }
        public string ContentEn { get; set; }
    }

    public class NewsItem
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int? NewsId { get; set; }
    }
}