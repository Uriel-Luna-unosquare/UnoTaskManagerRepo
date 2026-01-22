import { useEffect, useState } from "react";
import { getTasks } from "../api/tasks.api";
import type { Task } from "../models/Task.ts";
import { Box, Typography } from "@mui/material";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4">Tasks</Typography>

      {tasks.map(Task => (
        <Typography key={Task.id}>
          {Task.title}
        </Typography>
      ))}
    </Box>
  );
}
