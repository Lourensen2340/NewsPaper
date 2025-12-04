using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NewsPaper.Services
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string subDirectory = "images");
        bool DeleteFile(string fileUrl);
        string GetFilePath(string fileUrl);
        bool IsImageFile(IFormFile file);
    }
}


