using System.ComponentModel.DataAnnotations;

namespace TaskService.API.Models
{
    public class TaskItem
    {
        [Key]
        public int TaskId { get; set; }
        public string TaskTitle { get; set; }
        public string TaskDescription { get; set; }

        public int ProjectId { get; set; }
        public int AssignedTo { get; set; }   // UserId from UserService
        public int AssignedBy { get; set; }   // Manager Id

        public string Status { get; set; } = "Pending";
        public string Priority { get; set; } = "Medium";

        public DateTime StartDate { get; set; }
        public DateTime DueDate { get; set; }

        // Navigation Property
        public ICollection<Comment> Comments { get; set; } = new List<Comment>(); 
    }
}
