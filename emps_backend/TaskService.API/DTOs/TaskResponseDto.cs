namespace TaskService.API.DTOs
{
    public class TaskResponseDto
    {
        public int TaskId { get; set; }

        public string TaskTitle { get; set; }

        public string TaskDescription { get; set; }

        public int ProjectId { get; set; }

        public int AssignedTo { get; set; }

        public int AssignedBy { get; set; }

        public string Status { get; set; }

        public string Priority { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime DueDate { get; set; }
    }
}