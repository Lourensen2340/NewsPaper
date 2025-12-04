using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsPaper.Models;
using NewsPaper.Services;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NewsPaper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowAll")]
    public class AdminController : ControllerBase
    {
        private readonly INewsService _newsService;

        public AdminController(INewsService newsService)
        {
            _newsService = newsService;
        }

        // УДАЛИТЕ этот метод - он конфликтует с HttpPost
        // [HttpGet("login")]
        // [Produces("application/json")]
        // public async Task<IActionResult> Login([FromBody] LoginRequest request)
        public class LoginDto
        {
            public string email { get; set; }
            public string password { get; set; }
        }

        [HttpPost("login")]
        [Produces("application/json")]
        public IActionResult Login([FromBody] Dictionary<string, string> loginData)
        {
            try
            {
                Console.WriteLine($"🔑 Login attempt received");

                if (loginData == null)
                {
                    return BadRequest(new { success = false, error = "Request body is null" });
                }

                // Извлекаем данные
                loginData.TryGetValue("email", out var email);
                loginData.TryGetValue("Email", out var Email);
                loginData.TryGetValue("password", out var password);
                loginData.TryGetValue("Password", out var Password);

                // Используем любое из значений
                var finalEmail = email ?? Email;
                var finalPassword = password ?? Password;

                Console.WriteLine($"📧 Email: '{finalEmail}', 🔑 Password: '{finalPassword}'");

                if (string.IsNullOrWhiteSpace(finalEmail) || string.IsNullOrWhiteSpace(finalPassword))
                {
                    return BadRequest(new
                    {
                        success = false,
                        error = "Email and password are required"
                    });
                }

                // Проверка логина
                if (finalEmail.Trim() == "admin@news.com" && finalPassword == "admin123")
                {
                    Console.WriteLine("✅ Login successful");

                    // Устанавливаем cookie
                    Response.Cookies.Append("admin_auth", "true", new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = false, // Для localhost
                        SameSite = SameSiteMode.Lax,
                        Expires = DateTimeOffset.Now.AddHours(8)
                    });

                    return Ok(new
                    {
                        success = true,
                        message = "Login successful",
                        timestamp = DateTime.UtcNow
                    });
                }

                Console.WriteLine("❌ Login failed - invalid credentials");
                return Unauthorized(new
                {
                    success = false,
                    error = "Invalid email or password"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 Login error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(new
                {
                    success = false,
                    error = "Server error: " + ex.Message
                });
            }
        }

        [HttpOptions("login")]
        public IActionResult OptionsLogin()
        {
            Console.WriteLine("OPTIONS request received for login");

            Response.Headers.Add("Access-Control-Allow-Origin", Request.Headers["Origin"]);
            Response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
            Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            Response.Headers.Add("Access-Control-Max-Age", "86400");

            return Ok();
        }

        [HttpGet("news")]
        public async Task<IActionResult> GetNews()
        {
            if (!IsAuthenticated()) return Unauthorized();

            var news = await _newsService.GetAllNewsAsync();
            return Ok(news);
        }

        [HttpPost("news")]
        public async Task<IActionResult> CreateNews([FromBody] CreateNewsRequest request)
        {
            if (!IsAuthenticated()) return Unauthorized();

            if (ModelState.IsValid)
            {
                try
                {
                    await _newsService.CreateNewsWithTranslationsAsync(request);
                    return Ok(new { success = true, message = "News created successfully" });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { success = false, error = ex.Message });
                }
            }
            return BadRequest(new { success = false, error = "Invalid model state" });
        }

        [HttpPut("news/{id}")]
        public async Task<IActionResult> UpdateNews(int id, [FromBody] CreateNewsRequest request)
        {
            if (!IsAuthenticated()) return Unauthorized();

            if (ModelState.IsValid)
            {
                try
                {
                    await _newsService.UpdateNewsWithTranslationsAsync(id, request);
                    return Ok(new { success = true, message = "News updated successfully" });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { success = false, error = ex.Message });
                }
            }
            return BadRequest(new { success = false, error = "Invalid model state" });
        }

        [HttpDelete("news/{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            if (!IsAuthenticated()) return Unauthorized();

            try
            {
                await _newsService.DeleteNewsAsync(id);
                return Ok(new { success = true, message = "News deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpPost("upload-image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (!IsAuthenticated()) return Unauthorized();

            try
            {
                Console.WriteLine($"UploadImage called - File: {file?.FileName}, Size: {file?.Length}");

                if (file == null || file.Length == 0)
                    return BadRequest(new { success = false, error = "No file uploaded" });

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                    return BadRequest(new { success = false, error = "Invalid file type. Only images are allowed." });

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { success = false, error = "File size too large. Maximum size is 5MB." });

                var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsPath = Path.Combine(webRootPath, "images");

                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

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
                return BadRequest(new { success = false, error = $"Upload failed: {ex.Message}" });
            }
        }

        private bool IsAuthenticated()
        {
            var authCookie = Request.Cookies["admin_auth"];
            Console.WriteLine($"Auth cookie value: {authCookie}");
            return authCookie == "true";
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("admin_auth");
            return Ok(new { success = true, message = "Logged out successfully" });
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}