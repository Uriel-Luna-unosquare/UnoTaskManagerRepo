using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using UnoTaskManager.Domain.Entities;

namespace UnoTaskManager.Infrastructure.Persistence.Configurations;

public class TaskItemConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.ToTable("Tasks");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title)
               .IsRequired()
               .HasMaxLength(200);

        builder.Property(t => t.Description)
               .HasMaxLength(1000);

        builder.Property(t => t.IsCompleted)
               .IsRequired();

        builder.Property(t => t.DueDate)
               .IsRequired();

        builder.Property(t => t.CreatedAt)
               .IsRequired();
    }
}
