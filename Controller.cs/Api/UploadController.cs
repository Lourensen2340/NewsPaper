using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NewsPaper.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowAll")]
    public class UploadController : ControllerBase
    {
        [HttpPost("image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                Console.WriteLine($"UploadImage called - File: {file?.FileName}, Size: {file?.Length}");

                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "No file uploaded" });

                // Валидация типа файла
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Invalid file type. Only images are allowed." });

                // Валидация размера
                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { error = "File size too large. Maximum size is 5MB." });

                // Создание директорий
                var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsPath = Path.Combine(webRootPath, "images");

                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

                // Сохранение файла
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/images/{fileName}";

                Console.WriteLine($"File saved: {filePath}");

                return Ok(new
                {
                    success = true,
                    fileUrl = fileUrl,
                    message = "File uploaded successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Upload error: {ex.Message}");
                return BadRequest(new { error = $"Upload failed: {ex.Message}" });
            }
        }
    }
}