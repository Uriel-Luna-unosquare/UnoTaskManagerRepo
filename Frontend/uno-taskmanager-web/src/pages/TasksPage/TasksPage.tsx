import { useEffect, useState } from "react";
import { Box, Typography, Container, Card, CircularProgress } from "@mui/material";
import { taskService } from "../../services/taskService";
import type { Task } from "../../models/Task.ts";
import CreateTaskForm from "../../components/CreateTaskForm";
import {
  tasksContainerStyles,
  tasksHeaderStyles,
  tasksTitleStyles,
  tasksSubtitleStyles,
  formCardStyles,
  loadingContainerStyles,
  errorCardStyles,
  errorTextStyles,
  emptyStateCardStyles,
  emptyStateTextStyles,
  tasksGridStyles,
  getTaskCardBackgroundStyles,
  taskTitleStyles,
  taskCheckmarkStyles,
} from "./TasksPage.styles";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
    } catch {
      setError("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Box sx={tasksContainerStyles}>
      <Container maxWidth="md">
        <Box sx={tasksHeaderStyles}>
          <Typography variant="h3" sx={tasksTitleStyles}>
            My Tasks
          </Typography>
          <Typography variant="body1" sx={tasksSubtitleStyles}>
            Stay organized and track your progress
          </Typography>
        </Box>

        <Card sx={formCardStyles}>
          <CreateTaskForm onTaskCreated={loadTasks} />
        </Card>

        {loading && (
          <Box sx={loadingContainerStyles}>
            <CircularProgress sx={{ color: "#667eea" }} />
          </Box>
        )}

        {error && (
          <Card sx={errorCardStyles}>
            <Typography sx={errorTextStyles}>{error}</Typography>
          </Card>
        )}

        {!loading && tasks.length === 0 && (
          <Card sx={emptyStateCardStyles}>
            <Typography variant="h6" sx={emptyStateTextStyles}>
              No tasks yet. Create one to get started! 🚀
            </Typography>
          </Card>
        )}

        {!loading && tasks.length > 0 && (
          <Box sx={tasksGridStyles}>
            {tasks.map(task => (
              <Card
                key={task.id}
                sx={getTaskCardBackgroundStyles(task.isCompleted)}
              >
                <Typography sx={taskTitleStyles(task.isCompleted)}>
                  {task.title}
                </Typography>
                {task.isCompleted && (
                  <Typography sx={taskCheckmarkStyles}>✅</Typography>
                )}
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
