using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsPaper.Services;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NewsPaper.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowAll")]
    public class ScraperController : ControllerBase
    {
        private readonly IScraperService _scraperService;

        public ScraperController(IScraperService scraperService)
        {
            _scraperService = scraperService;
        }

        [HttpPost("upload-news")]
        public async Task<IActionResult> UploadNews([FromBody] NewsUploadRequest request)
        {
            try
            {
                var result = await _scraperService.ScrapeAndCreateNewsAsync(request);
                if (result.Success)
                {
                    return Ok(new { success = true, message = result.Message, newsId = result.NewsId });
                }
                else
                {
                    return BadRequest(new { success = false, error = result.Message });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpPost("upload-image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            try
            {
                Console.WriteLine($"Scraper UploadImage called - File: {file?.FileName}, Size: {file?.Length}");

                if (file == null || file.Length == 0)
                    return BadRequest(new { success = false, error = "No file uploaded" });

                // Валидация типа файла
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                    return BadRequest(new { success = false, error = "Invalid file type. Only images are allowed." });

                // Валидация размера
                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { success = false, error = "File size too large. Maximum size is 5MB." });

                using var stream = file.OpenReadStream();
                var imageUrl = await _scraperService.UploadImageAsync(stream, file.FileName);

                return Ok(new { success = true, fileUrl = imageUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Scraper Upload error: {ex.Message}");
                return BadRequest(new { success = false, error = $"Upload failed: {ex.Message}" });
            }
        }
    }
}