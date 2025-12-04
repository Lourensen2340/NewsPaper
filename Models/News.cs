using System;
using System.ComponentModel.DataAnnotations;

namespace NewsPaper.Models
{
    public class News
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Subtitle { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [StringLength(200)]
        public string TitleEn { get; set; }

        [StringLength(500)]
        public string SubtitleEn { get; set; }

        [Required]
        public string ContentEn { get; set; }

        public string ImageUrl { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime UpdatedDate { get; set; }

        public bool IsPublished { get; set; } = true;
    }

    public class CreateNewsRequest
    {
        public string ImageUrl { get; set; }
        public bool IsPublished { get; set; } = true;

        [Required(ErrorMessage = "Russian title is required")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Russian title must be between 5 and 200 characters")]
        public string TitleRu { get; set; }

        [StringLength(500, ErrorMessage = "Russian subtitle cannot exceed 500 characters")]
        public string SubtitleRu { get; set; }

        [Required(ErrorMessage = "Russian content is required")]
        [StringLength(10000, MinimumLength = 20, ErrorMessage = "Russian content must be between 20 and 10000 characters")]
        public string ContentRu { get; set; }

        [Required(ErrorMessage = "English title is required")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "English title must be between 5 and 200 characters")]
        public string TitleEn { get; set; }

        [StringLength(500, ErrorMessage = "English subtitle cannot exceed 500 characters")]
        public string SubtitleEn { get; set; }

        [Required(ErrorMessage = "English content is required")]
        [StringLength(10000, MinimumLength = 20, ErrorMessage = "English content must be between 20 and 10000 characters")]
        public string ContentEn { get; set; }
    }
}