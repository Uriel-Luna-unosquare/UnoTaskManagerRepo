using UnoTaskManager.API.Middlewares;
using UnoTaskManager.Application;
using UnoTaskManager.Application.DTOs;
using UnoTaskManager.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using UnoTaskManager.Application.Interfaces.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Uno Task Manager API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = options.DefaultPolicy;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Minimal API Endpoints

// Auth endpoints (public)
app.MapPost("/api/auth/login", async (LoginRequest request, IConfiguration configuration) =>
{
    if (request.Username != "admin" || request.Password != "password")
        return Results.Unauthorized();

    var jwtSettings = configuration.GetSection("Jwt");
    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwtSettings["Key"]!)
    );

    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, "1"),
        new Claim(JwtRegisteredClaimNames.UniqueName, request.Username),
        new Claim(ClaimTypes.Role, "User")
    };

    var token = new JwtSecurityToken(
        issuer: jwtSettings["Issuer"],
        audience: jwtSettings["Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(
            int.Parse(jwtSettings["ExpiresInMinutes"]!)
        ),
        signingCredentials: new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        )
    );

    return Results.Ok(new
    {
        token = new JwtSecurityTokenHandler().WriteToken(token)
    });
})
.AllowAnonymous()
.WithName("Login")
.WithTags("Auth")
.Produces(200)
.Produces(401);

// Task endpoints
var tasksGroup = app.MapGroup("/api/tasks")
    .RequireAuthorization()
    .WithTags("Tasks");

tasksGroup.MapGet("/", async (ITaskService taskService) =>
{
    var tasks = await taskService.GetAllAsync();
    return Results.Ok(tasks);
})
.WithName("GetAllTasks")
.Produces<IEnumerable<TaskDto>>(200);

tasksGroup.MapGet("/{id:guid}", async (Guid id, ITaskService taskService) =>
{
    var task = await taskService.GetByIdAsync(id);
    return Results.Ok(task);
})
.WithName("GetTaskById")
.Produces<TaskDto>(200);

tasksGroup.MapPost("/", async (CreateTaskDto dto, ITaskService taskService) =>
{
    var createdTask = await taskService.CreateAsync(dto);
    return Results.Created($"/api/tasks/{createdTask.Id}", createdTask);
})
.AllowAnonymous()
.WithName("CreateTask")
.Produces<TaskDto>(201)
.Produces(400);

tasksGroup.MapPut("/{id:guid}", async (Guid id, UpdateTaskDto dto, ITaskService taskService) =>
{
    await taskService.UpdateAsync(id, dto);
    return Results.NoContent();
})
.WithName("UpdateTask")
.Produces(204)
.Produces(404);

tasksGroup.MapDelete("/{id:guid}", async (Guid id, ITaskService taskService) =>
{
    await taskService.DeleteAsync(id);
    return Results.NoContent();
})
.WithName("DeleteTask")
.Produces(204)
.Produces(404);

app.Run();

public record LoginRequest(string Username, string Password);