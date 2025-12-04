using Microsoft.AspNetCore.Mvc;
using NewsPaper.Models;
using NewsPaper.Services;
using System;
using System.Threading.Tasks;

namespace NewsPaper.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        // GET: api/News/latest?count=5
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestNews([FromQuery] int count = 5)
        {
            try
            {
                var news = await _newsService.GetLatestNewsAsync(count);
                return Ok(news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting latest news: {ex.Message}" });
            }
        }

        // GET: api/News
        [HttpGet]
        public async Task<IActionResult> GetAllNews()
        {
            try
            {
                var news = await _newsService.GetAllNewsAsync();
                return Ok(news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting all news: {ex.Message}" });
            }
        }

        // GET: api/News/admin/all
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllNewsForAdmin()
        {
            try
            {
                var news = await _newsService.GetAllNewsForAdminAsync();
                return Ok(news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting all news for admin: {ex.Message}" });
            }
        }

        // GET: api/News/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            try
            {
                var news = await _newsService.GetNewsByIdAsync(id);
                if (news == null)
                    return NotFound(new { message = "News not found" });

                return Ok(news);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error getting news by id: {ex.Message}" });
            }
        }

        // POST: api/News
        [HttpPost]
        public async Task<IActionResult> CreateNews([FromBody] CreateNewsRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _newsService.CreateNewsWithTranslationsAsync(request);
                return Ok(new { message = "News created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error creating news: {ex.Message}" });
            }
        }

        // PUT: api/News/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(int id, [FromBody] CreateNewsRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _newsService.UpdateNewsWithTranslationsAsync(id, request);
                return Ok(new { message = "News updated successfully" });
            }
            catch (Exception ex)
            {
                if (ex.Message == "News not found")
                    return NotFound(new { message = "News not found" });

                return StatusCode(500, new { message = $"Error updating news: {ex.Message}" });
            }
        }

        // DELETE: api/News/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            try
            {
                await _newsService.DeleteNewsAsync(id);
                return Ok(new { message = "News deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error deleting news: {ex.Message}" });
            }
        }
    }
}