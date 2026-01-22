using UnoTaskManager.Application.DTOs;

namespace UnoTaskManager.Application.Interfaces.Services
{
    public interface ITaskService
    {
        Task<TaskDto> CreateAsync(CreateTaskDto dto);
        Task<IEnumerable<TaskDto>> GetAllAsync();
        Task<TaskDto> GetByIdAsync(Guid id);
        Task UpdateAsync(Guid id, UpdateTaskDto dto);
        Task DeleteAsync(Guid id);
    }
}
