using Microsoft.EntityFrameworkCore;
using UnoTaskManager.Infrastructure.Persistence;

namespace UnoTaskManager.Tests.Helpers;

public static class DbContextFactory
{
    public static TaskDbContext Create()
    {
        var options = new DbContextOptionsBuilder<TaskDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new TaskDbContext(options);
    }
}