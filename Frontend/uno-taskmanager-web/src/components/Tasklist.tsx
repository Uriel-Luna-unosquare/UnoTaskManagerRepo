import { useEffect, useState } from "react";
import type { Task } from "../models/task.ts";
import { taskService } from "../services/taskService";

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService
      .getAll()
      .then(setTasks)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          {task.title} {task.isCompleted && "✅"}
        </li>
      ))}
    </ul>
  );
};
