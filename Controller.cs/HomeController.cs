using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsPaper.Services;
using System;
using System.Threading.Tasks;

namespace NewsPaper.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors("AllowAll")]
    public class HomeController : ControllerBase  // Наследуемся от ControllerBase для API
    {
        private readonly INewsService _newsService;

        public HomeController(INewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "News API Home" });
        }

        [HttpPost("set-language")]
        public IActionResult SetLanguage([FromBody] LanguageRequest request)
        {
            Response.Cookies.Append("preferred_language", request.Language, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddYears(1)
            });
            return Ok(new { success = true });
        }
    }

    public class LanguageRequest
    {
        public string Language { get; set; }
        public string ReturnUrl { get; set; }
    }
}