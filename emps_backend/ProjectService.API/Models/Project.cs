using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectService.API.Models
{
    [Table("projects")]
    public class Project
    {
        [Key]
        [Column("project_id")]
        public int ProjectId { get; set; }

        [Required]
        [Column("project_name")]
        public string ProjectName { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("start_date")]
        public DateTime? StartDate { get; set; }

        [Column("end_date")]
        public DateTime? EndDate { get; set; }

        [Column("manager_id")]
        public int? ManagerId { get; set; }
    }
}