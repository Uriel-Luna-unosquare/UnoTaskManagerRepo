using UnoTaskManager.API.Middlewares;
using UnoTaskManager.Application;
using UnoTaskManager.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// OpenAPI (nativo .NET 9)
builder.Services.AddOpenApi();

// DI
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();