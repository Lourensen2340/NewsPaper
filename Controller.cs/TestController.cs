using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;

namespace NewsPaper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                message = "API is working!",
                timestamp = DateTime.UtcNow,
                endpoints = new[] {
                    "GET /api/test",
                    "GET /api/public/news/latest",
                    "GET /api/public/news",
                    "GET /api/public/news/{id}",
                    "POST /api/admin/login",
                    "GET /api/admin/news",
                    "POST /api/admin/news",
                    "PUT /api/admin/news/{id}",
                    "DELETE /api/admin/news/{id}",
                    "POST /api/admin/upload-image"
                }
            });
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new
            {
                message = "Pong!",
                status = "OK",
                server_time = DateTime.UtcNow
            });
        }

        // Добавьте этот метод для корневого URL
        [HttpGet("/")]
        public IActionResult Root()
        {
            return Ok(new
            {
                message = "NewsPaper API is running!",
                timestamp = DateTime.UtcNow,
                documentation = "Visit /swagger for API documentation",
                health = "OK",
                endpoints = new[] {
                    "/api/test",
                    "/api/public/news/latest",
                    "/swagger"
                }
            });
        }
    }
}