using Microsoft.Extensions.DependencyInjection;
using UnoTaskManager.Application.Interfaces.Services;
using UnoTaskManager.Application.Services;

namespace UnoTaskManager.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<ITaskService, TaskService>();

        return services;
    }
}