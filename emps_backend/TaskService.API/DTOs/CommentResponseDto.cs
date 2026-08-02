namespace TaskService.API.DTOs
{
    public class CommentResponseDto
    {
        public int CommentId { get; set; }

        public int TaskId { get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; }

        public string CommentText { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}