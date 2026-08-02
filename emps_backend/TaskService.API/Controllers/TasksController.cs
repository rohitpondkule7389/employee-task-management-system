using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskService.API.Constants;
using TaskService.API.Controllers;
using TaskService.API.Data;
using TaskService.API.DTOs;
using TaskService.API.Models;

//[Authorize]
[Route("api/tasks")]
[ApiController]
public class TasksController : BaseController
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET ALL TASKS
    [HttpGet]
    public IActionResult GetTasks()
    {
        var tasks = _context.Tasks
            .Select(x => new TaskResponseDto
            {
                TaskId = x.TaskId,
                TaskTitle = x.TaskTitle,
                TaskDescription = x.TaskDescription,
                ProjectId = x.ProjectId,
                AssignedTo = x.AssignedTo,
                AssignedBy = x.AssignedBy,
                Priority = x.Priority,
                Status = x.Status,
                StartDate = x.StartDate,
                DueDate = x.DueDate
            })
            .ToList();

        return Ok(tasks);
    }

    // CREATE TASK
    //[Authorize(Roles = Roles.Admin)]
    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
    {
        // Validation 1
        if (dto.DueDate < dto.StartDate)
        {
            return BadRequest("Due Date cannot be earlier than Start Date.");
        }

        // Validation 2
        bool duplicateTask = _context.Tasks.Any(x =>
            x.ProjectId == dto.ProjectId &&
            x.TaskTitle == dto.TaskTitle);

        if (duplicateTask)
        {
            return BadRequest("Task already exists in this project.");
        }

        var task = new TaskItem
        {
            TaskTitle = dto.TaskTitle,
            TaskDescription = dto.TaskDescription,
            ProjectId = dto.ProjectId,
            AssignedTo = dto.AssignedTo,
            AssignedBy = dto.AssignedBy,
            Priority = dto.Priority,
            StartDate = dto.StartDate,
            DueDate = dto.DueDate,
            Status = TaskStatuses.Pending
        };

        _context.Tasks.Add(task);

        await _context.SaveChangesAsync();

        return Ok(new TaskResponseDto
        {
            TaskId = task.TaskId,
            TaskTitle = task.TaskTitle,
            TaskDescription = task.TaskDescription,
            ProjectId = task.ProjectId,
            AssignedTo = task.AssignedTo,
            AssignedBy = task.AssignedBy,
            Priority = task.Priority,
            Status = task.Status,
            StartDate = task.StartDate,
            DueDate = task.DueDate
        });
    }

    // GET BY ID
    [HttpGet("{id}")]
    public IActionResult GetTask(int id)
    {
        var task = _context.Tasks
            .Where(x => x.TaskId == id)
            .Select(x => new TaskResponseDto
            {
                TaskId = x.TaskId,
                TaskTitle = x.TaskTitle,
                TaskDescription = x.TaskDescription,
                ProjectId = x.ProjectId,
                AssignedTo = x.AssignedTo,
                AssignedBy = x.AssignedBy,
                Priority = x.Priority,
                Status = x.Status,
                StartDate = x.StartDate,
                DueDate = x.DueDate
            })
            .FirstOrDefault();

        if (task == null)
            return NotFound();

        return Ok(task);
    }

    // GET TASKS OF PARTICULAR EMPLOYEE
    [HttpGet("employee/{employeeId}")]
    public IActionResult GetEmployeeTasks(int employeeId)
    {
        var tasks = _context.Tasks
            .Where(t => t.AssignedTo == employeeId)
            .ToList();

        return Ok(tasks);
    }

    // UPDATE STATUS
    [HttpPut("status/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, string status)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        task.Status = status;
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    // UPDATE FULL TASK
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem task)
    {
        var existing = await _context.Tasks.FindAsync(id);
        if (existing == null) return NotFound();

        existing.TaskTitle = task.TaskTitle;
        existing.TaskDescription = task.TaskDescription;
        existing.Status = task.Status;
        existing.Priority = task.Priority;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE TASK
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] string status)
    {
        var task = await _context.Tasks.FindAsync(id);

        if (task == null)
            return NotFound();

        task.Status = status;

        await _context.SaveChangesAsync();

        return Ok(task);
    }


}