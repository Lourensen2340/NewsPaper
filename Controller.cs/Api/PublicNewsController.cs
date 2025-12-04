using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using NewsPaper.Services;
using System.Threading.Tasks;

namespace NewsPaper.Controllers
{
    [ApiController]
    [Route("api/public/news")] 
    [EnableCors("AllowAll")]
    public class PublicNewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public PublicNewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestNews([FromQuery] int count = 5, [FromQuery] string language = "ru")
        {
            var news = await _newsService.GetLatestNewsAsync(count, language);
            return Ok(news);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNews([FromQuery] string language = "ru")
        {
            var news = await _newsService.GetAllNewsAsync(language);
            return Ok(news);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id, [FromQuery] string language = "ru")
        {
            var news = await _newsService.GetNewsByIdAsync(id, language);
            if (news == null)
                return NotFound();

            return Ok(news);
        }
    }
}