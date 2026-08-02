using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskService.API.Data;
using TaskService.API.DTOs;
using TaskService.API.Models;

namespace TaskService.API.Controllers
{
    [ApiController]
    [Route("api/comments")]
   // [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public CommentsController(
            ApplicationDbContext context,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(CreateCommentDto dto)
        {
            var task = await _context.Tasks.FindAsync(dto.TaskId);

            if (task == null)
                return NotFound("Task not found.");

            var comment = new Comment
            {
                TaskId = dto.TaskId,
                UserId = dto.UserId,
                CommentText = dto.CommentText,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);

            await _context.SaveChangesAsync();

            return Ok(new CommentResponseDto
            {
                CommentId = comment.CommentId,
                TaskId = comment.TaskId,
                UserId = comment.UserId,
                CommentText = comment.CommentText,
                CreatedAt = comment.CreatedAt
            });
        }

        [HttpGet("task/{taskId}")]
        public async Task<IActionResult> GetCommentsByTask(int taskId)
        {
            var comments = await _context.Comments
                .Where(c => c.TaskId == taskId)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            var result = new List<CommentResponseDto>();

            foreach (var comment in comments)
            {
                string userName = "Unknown";

                var response = await _httpClient.GetAsync(
                    $"http://localhost:7000/users/{comment.UserId}");

                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();

                    var user = System.Text.Json.JsonSerializer.Deserialize<UserDto>
                    (
                        json,
                        new System.Text.Json.JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        }
                    );

                    if (user != null)
                        userName = user.FullName;
                }

                result.Add(new CommentResponseDto
                {
                    CommentId = comment.CommentId,
                    TaskId = comment.TaskId,
                    UserId = comment.UserId,
                    UserName = userName,
                    CommentText = comment.CommentText,
                    CreatedAt = comment.CreatedAt
                });
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, UpdateCommentDto dto)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
                return NotFound("Comment not found.");

            comment.CommentText = dto.CommentText;

            await _context.SaveChangesAsync();

            return Ok(new CommentResponseDto
            {
                CommentId = comment.CommentId,
                TaskId = comment.TaskId,
                UserId = comment.UserId,
                CommentText = comment.CommentText,
                CreatedAt = comment.CreatedAt
            });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
                return NotFound("Comment not found.");

            _context.Comments.Remove(comment);

            await _context.SaveChangesAsync();

            return Ok("Comment deleted successfully.");
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCommentsByUser(int userId)
        {
            var comments = await _context.Comments
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(comments);
        }



    }
}