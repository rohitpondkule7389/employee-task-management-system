using System.ComponentModel.DataAnnotations;

namespace TaskService.API.DTOs
{
    public class UpdateCommentDto
    {
        [Required]
        [StringLength(1000)]
        public string CommentText { get; set; }
    }
}