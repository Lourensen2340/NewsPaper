using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewsPaper.Models;
using NewsPaper.Services;
using System;
using System.Threading.Tasks;

namespace NewsPaper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(typeof(FileUploadResponse), 200)]
        [ProducesResponseType(typeof(FileUploadResponse), 400)]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new FileUploadResponse
                    {
                        Success = false,
                        Error = "No file uploaded"
                    });

                var fileUrl = await _fileService.SaveFileAsync(file);
                return Ok(new FileUploadResponse
                {
                    Success = true,
                    FileUrl = fileUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new FileUploadResponse
                {
                    Success = false,
                    Error = ex.Message
                });
            }
        }

        [HttpDelete("delete")]
        public IActionResult DeleteFile([FromQuery] string fileUrl)
        {
            try
            {
                var result = _fileService.DeleteFile(fileUrl);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}