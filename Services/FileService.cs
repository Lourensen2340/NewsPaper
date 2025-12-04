using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NewsPaper.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string[] _allowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
        private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB

        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string subDirectory = "images")
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            if (!IsImageFile(file))
                throw new ArgumentException("File is not a valid image");

            if (file.Length > _maxFileSize)
                throw new ArgumentException("File size exceeds limit");

            var uploadsDir = Path.Combine(_environment.WebRootPath, subDirectory);
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/{subDirectory}/{fileName}";
        }

        public bool DeleteFile(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl))
                return false;

            try
            {
                var filePath = GetFilePath(fileUrl);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public string GetFilePath(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl))
                return null;

            var fileName = Path.GetFileName(fileUrl);
            return Path.Combine(_environment.WebRootPath, "images", fileName);
        }

        public bool IsImageFile(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return Array.Exists(_allowedImageExtensions, ext => ext == extension);
        }
    }
}