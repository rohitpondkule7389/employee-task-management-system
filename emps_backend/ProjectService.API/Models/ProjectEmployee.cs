using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectService.API.Models
{
    public class ProjectEmployee
    {
        [Key]
        public int ProjectEmployeeId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        public DateTime AssignedDate { get; set; } = DateTime.Now;

        // Navigation Property
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }
}