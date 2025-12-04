using Microsoft.AspNetCore.Http;

namespace NewsPaper.Models
{
    public class FileUploadModel
    {
        public IFormFile File { get; set; }
    }

    public class FileUploadResponse
    {
        public bool Success { get; set; }
        public string FileUrl { get; set; }
        public string Error { get; set; }
    }
}