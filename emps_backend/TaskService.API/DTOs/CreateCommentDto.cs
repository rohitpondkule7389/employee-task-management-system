using System.ComponentModel.DataAnnotations;

namespace TaskService.API.DTOs
{
    public class CreateCommentDto
    {
        [Required]
        public int TaskId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(1000)]
        public string CommentText { get; set; }
    }
}