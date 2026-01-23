using UnoTaskManager.Application.Services;
using UnoTaskManager.Application.DTOs;
using UnoTaskManager.Application.Exceptions;
using UnoTaskManager.Tests.Helpers;
using Xunit;

namespace UnoTaskManager.Tests.Services;

public class TaskServiceTests
{
    [Fact]
    public async Task CreateAsync_Should_Create_Task_When_Data_Is_Valid()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var dto = new CreateTaskDto
        {
            Title = "Test task",
            Description = "Test description",
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        // Act
        var result = await service.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Title, result.Title);
        Assert.False(result.IsCompleted);
    }

    [Fact]
    public async Task CreateAsync_Should_Throw_When_Title_Is_Empty()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var dto = new CreateTaskDto
        {
            Title = "",
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(() =>
            service.CreateAsync(dto));
    }

    [Fact]
    public async Task CreateAsync_Should_Throw_When_DueDate_Is_In_Past()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var dto = new CreateTaskDto
        {
            Title = "Invalid date",
            DueDate = DateTime.UtcNow.AddDays(-1)
        };

        // Act & Assert
        await Assert.ThrowsAsync<ValidationException>(() =>
            service.CreateAsync(dto));
    }

    [Fact]
    public async Task GetByIdAsync_Should_Throw_When_Task_Does_Not_Exist()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            service.GetByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task DeleteAsync_Should_Remove_Task()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var task = await service.CreateAsync(new CreateTaskDto
        {
            Title = "To delete",
            DueDate = DateTime.UtcNow.AddDays(1)
        });

        // Act
        await service.DeleteAsync(task.Id);

        // Assert
        Assert.Empty(context.Tasks);
    }

    [Fact]
    public async Task UpdateAsync_Should_Update_Task_Data()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Original title",
            Description = "Original description",
            DueDate = DateTime.UtcNow.AddDays(1)
        });

        var updateDto = new UpdateTaskDto
        {
            Title = "Updated title",
            Description = "Updated description",
            DueDate = DateTime.UtcNow.AddDays(3),
            IsCompleted = false
        };

        // Act
        await service.UpdateAsync(created.Id, updateDto);

        // Assert
        var updated = await service.GetByIdAsync(created.Id);

        Assert.Equal(updateDto.Title, updated.Title);
        Assert.Equal(updateDto.Description, updated.Description);
        Assert.Equal(updateDto.DueDate, updated.DueDate);
        Assert.False(updated.IsCompleted);
    }

    [Fact]
    public async Task UpdateAsync_Should_Mark_Task_As_Completed_When_IsCompleted_Is_True()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Complete me",
            DueDate = DateTime.UtcNow.AddDays(1)
        });

        var updateDto = new UpdateTaskDto
        {
            Title = created.Title,
            Description = created.Description,
            DueDate = created.DueDate,
            IsCompleted = true
        };

        // Act
        await service.UpdateAsync(created.Id, updateDto);

        // Assert
        var updated = await service.GetByIdAsync(created.Id);

        Assert.True(updated.IsCompleted);
    }

    [Fact]
    public async Task UpdateAsync_Should_Throw_NotFoundException_When_Task_Does_Not_Exist()
    {
        // Arrange
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var updateDto = new UpdateTaskDto
        {
            Title = "Does not matter",
            DueDate = DateTime.UtcNow.AddDays(1),
            IsCompleted = false
        };

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() =>
            service.UpdateAsync(Guid.NewGuid(), updateDto));
    }


}
