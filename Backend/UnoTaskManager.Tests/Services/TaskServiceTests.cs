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
            Description = "Description",
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        // Act
        var result = await service.CreateAsync(dto);

        // Assert
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("Test task", result.Title);
        Assert.False(result.IsCompleted);
    }

    [Fact]
    public async Task CreateAsync_Should_Throw_When_Title_Is_Empty()
    {
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var dto = new CreateTaskDto
        {
            Title = "",
            Description = "Desc",
            DueDate = DateTime.UtcNow.AddDays(1)
        };

        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreateAsync(dto));
    }

    [Fact]
    public async Task CreateAsync_Should_Throw_When_DueDate_Is_In_The_Past()
    {
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var dto = new CreateTaskDto
        {
            Title = "Invalid task",
            Description = "Desc",
            DueDate = DateTime.UtcNow.AddDays(-1)
        };

        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.CreateAsync(dto));
    }

    [Fact]
    public async Task GetByIdAsync_Should_Return_Task_When_Exists()
    {
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Task",
            Description = "Desc",
            DueDate = DateTime.UtcNow.AddDays(1)
        });

        var result = await service.GetByIdAsync(created.Id);

        Assert.Equal(created.Id, result.Id);
    }

    [Fact]
    public async Task GetByIdAsync_Should_Throw_When_Not_Found()
    {
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            service.GetByIdAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task UpdateAsync_Should_Update_Task()
    {
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Old title",
            Description = "Desc",
            DueDate = DateTime.UtcNow.AddDays(1)
        });

        await service.UpdateAsync(created.Id, new UpdateTaskDto
        {
            Title = "New title",
            Description = "Updated",
            DueDate = DateTime.UtcNow.AddDays(2),
            IsCompleted = true
        });

        var updated = await service.GetByIdAsync(created.Id);

        Assert.Equal("New title", updated.Title);
        Assert.True(updated.IsCompleted);
    }


    [Fact]
    public async Task DeleteAsync_Should_Remove_Task()
    {
        var context = DbContextFactory.Create();
        var service = new TaskService(context);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Task",
            Description = "Desc",
            DueDate = DateTime.UtcNow.AddDays(1)
        });

        await service.DeleteAsync(created.Id);

        await Assert.ThrowsAsync<NotFoundException>(() =>
            service.GetByIdAsync(created.Id));
    }
}