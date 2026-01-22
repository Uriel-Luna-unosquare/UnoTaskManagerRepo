using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnoTaskManager.Domain.Entities
{
    public class TaskItem
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; } = null!;
        public string? Description { get; private set; }
        public bool IsCompleted { get; private set; }
        public DateTime DueDate { get; private set; }
        public DateTime CreatedAt { get; private set; }
        
        // Constructor para EF
        private TaskItem() { }
        
        public TaskItem(string title, string? description, DateTime dueDate)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title is required", nameof(title));
            
            if (dueDate.Date < DateTime.UtcNow.Date)
                throw new ArgumentException("Due date cannot be in the past", nameof(dueDate));
            
            Id = Guid.NewGuid();
            Title = title;
            Description = description;
            DueDate = dueDate;
            CreatedAt = DateTime.UtcNow;
            IsCompleted = false;
        }
        
        public void Update(string title, string? description, DateTime dueDate)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title is required", nameof(title));
            
            if (dueDate.Date < DateTime.UtcNow.Date)
                throw new ArgumentException("Due date cannot be in the past", nameof(dueDate));
            
            Title = title;
            Description = description;
            DueDate = dueDate;
        }
        
        public void MarkAsCompleted()
        {
            IsCompleted = true;
        }
    }
}
