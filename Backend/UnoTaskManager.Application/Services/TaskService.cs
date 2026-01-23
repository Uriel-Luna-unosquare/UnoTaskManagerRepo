using Microsoft.EntityFrameworkCore;
using UnoTaskManager.Application.DTOs;
using UnoTaskManager.Application.Exceptions;
using UnoTaskManager.Application.Interfaces.Services;
using UnoTaskManager.Domain.Entities;
using UnoTaskManager.Infrastructure.Persistence;

namespace UnoTaskManager.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly TaskDbContext _context;

        public TaskService(TaskDbContext context)
        {
            _context = context;
        }

        public async Task<TaskDto> CreateAsync(CreateTaskDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ValidationException("Title is required");

            if (dto.DueDate < DateTime.UtcNow.Date)
                throw new ValidationException("Due date cannot be in the past");

            var task = new TaskItem(dto.Title, dto.Description, dto.DueDate);

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<IEnumerable<TaskDto>> GetAllAsync()
        {
            return await _context.Tasks
                .AsNoTracking()
                .Select(t => MapToDto(t))
                .ToListAsync();
        }

        public async Task<TaskDto> GetByIdAsync(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task is null)
                throw new NotFoundException("Task not found");

            return MapToDto(task);
        }

        public async Task UpdateAsync(Guid id, UpdateTaskDto dto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task is null)
                throw new NotFoundException("Task not found");

            task.Update(dto.Title, dto.Description, dto.DueDate);

            if (dto.IsCompleted)
                task.MarkAsCompleted();

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task is null)
                throw new NotFoundException("Task not found");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }

        private static TaskDto MapToDto(TaskItem task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                DueDate = task.DueDate,
                CreatedAt = task.CreatedAt
            };
        }
    }
}
