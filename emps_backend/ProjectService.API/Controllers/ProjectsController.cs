using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectService.API.Data;
using ProjectService.API.DTOs;
using ProjectService.API.Models;
using System.Text.Json;

namespace ProjectService.API.Controllers
{
    [ApiController]
    [Route("api/projects")]
    //[Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public ProjectsController(
            ApplicationDbContext context,
            IHttpClientFactory factory)
        {
            _context = context;
            _httpClient = factory.CreateClient();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _context.Projects
                .Select(p => new ProjectResponseDto
                {
                    ProjectId = p.ProjectId,
                    ProjectName = p.ProjectName,
                    Description = p.Description,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    ManagerId = p.ManagerId
                })
                .ToListAsync();

            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectById(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                return NotFound("Project not found.");

            return Ok(new ProjectResponseDto
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                Description = project.Description,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                ManagerId = project.ManagerId
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(CreateProjectDto dto)
        {
            // Validation 1
            if (dto.EndDate < dto.StartDate)
            {
                return BadRequest("End Date cannot be earlier than Start Date.");
            }

            // Validation 2
            bool projectExists = await _context.Projects
                .AnyAsync(p => p.ProjectName == dto.ProjectName);

            if (projectExists)
            {
                return BadRequest("Project Name already exists.");
            }

            var project = new Project
            {
                ProjectName = dto.ProjectName,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                ManagerId = dto.ManagerId
            };

            _context.Projects.Add(project);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetProjectById),
                new { id = project.ProjectId },
                new ProjectResponseDto
                {
                    ProjectId = project.ProjectId,
                    ProjectName = project.ProjectName,
                    Description = project.Description,
                    StartDate = project.StartDate,
                    EndDate = project.EndDate,
                    ManagerId = project.ManagerId
                });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectDto dto)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound("Project not found.");
            }

            // Validation 1
            if (dto.EndDate < dto.StartDate)
            {
                return BadRequest("End Date cannot be earlier than Start Date.");
            }

            // Validation 2
            bool duplicateProject = await _context.Projects
                .AnyAsync(p => p.ProjectName == dto.ProjectName &&
                               p.ProjectId != id);

            if (duplicateProject)
            {
                return BadRequest("Project Name already exists.");
            }

            project.ProjectName = dto.ProjectName;
            project.Description = dto.Description;
            project.StartDate = dto.StartDate;
            project.EndDate = dto.EndDate;
            project.ManagerId = dto.ManagerId;

            await _context.SaveChangesAsync();

            return Ok(new ProjectResponseDto
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                Description = project.Description,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                ManagerId = project.ManagerId
            });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound("Project not found.");
            }

            _context.Projects.Remove(project);

            await _context.SaveChangesAsync();

            return Ok("Project deleted successfully.");
        }


        [HttpPost("assign-employee")]
        public async Task<IActionResult> AssignEmployee(AssignEmployeeDto dto)
        {
            // Check Project Exists
            var project = await _context.Projects.FindAsync(dto.ProjectId);

            if (project == null)
                return NotFound("Project not found.");

            // Prevent Duplicate Assignment
            bool alreadyAssigned = await _context.ProjectEmployees
                .AnyAsync(x => x.ProjectId == dto.ProjectId &&
                               x.EmployeeId == dto.EmployeeId);

            if (alreadyAssigned)
                return BadRequest("Employee already assigned to this project.");

            var assignment = new ProjectEmployee
            {
                ProjectId = dto.ProjectId,
                EmployeeId = dto.EmployeeId
            };

            _context.ProjectEmployees.Add(assignment);

            await _context.SaveChangesAsync();

            return Ok("Employee assigned successfully.");
        }



        [HttpGet("{projectId}/employees")]
        public async Task<IActionResult> GetAssignedEmployees(int projectId)
        {
            var exists = await _context.Projects.AnyAsync(x => x.ProjectId == projectId);

            if (!exists)
                return NotFound("Project not found.");

            var employees = await _context.ProjectEmployees
                .Where(x => x.ProjectId == projectId)
                .Select(x => new AssignedEmployeeDto
                {
                    EmployeeId = x.EmployeeId,
                    AssignedDate = x.AssignedDate
                })
                .ToListAsync();

            return Ok(employees);
        }

        [HttpGet("{projectId}/employee-details")]
        public async Task<IActionResult> GetAssignedEmployeeDetails(int projectId)
        {
            // Assigned employee IDs
            var assignedIds = await _context.ProjectEmployees
                .Where(x => x.ProjectId == projectId)
                .Select(x => x.EmployeeId)
                .ToListAsync();

            if (!assignedIds.Any())
                return Ok(new List<AssignedEmployeeDetailDto>());

            // Call UserService through Gateway
            var response = await _httpClient.GetAsync("http://localhost:7000/users/employees");

            if (!response.IsSuccessStatusCode)
                return BadRequest("Unable to fetch employees.");

            var json = await response.Content.ReadAsStringAsync();

            var employees = JsonSerializer.Deserialize<List<AssignedEmployeeDetailDto>>
            (
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

            var result = employees
                .Where(x => assignedIds.Contains(x.UserId))
                .ToList();

            return Ok(result);
        }


    }
}