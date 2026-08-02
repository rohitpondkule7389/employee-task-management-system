using System.ComponentModel.DataAnnotations;

namespace TaskService.API.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        public string TaskTitle { get; set; }

        public string? TaskDescription { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int AssignedTo { get; set; }

        [Required]
        public int AssignedBy { get; set; }

        [Required]
        public string Priority { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }
    }
}