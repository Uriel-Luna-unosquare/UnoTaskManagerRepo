import {
  Box,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Task } from "../models/task";
import { taskService } from "../services/taskService";

type Props = {
  task: Task;
  onChanged: () => void;
};

export default function TaskItem({ task, onChanged }: Props) {
  const toggleCompleted = async () => {
    await taskService.update(task.id, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      isCompleted: !task.isCompleted,
    });
    onChanged();
  };

  const deleteTask = async () => {
    await taskService.remove(task.id);
    onChanged();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border={1}
      borderRadius={1}
      p={1}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Checkbox
          checked={task.isCompleted}
          onChange={toggleCompleted}
        />
        <Typography
          sx={{
            textDecoration: task.isCompleted
              ? "line-through"
              : "none",
          }}
        >
          {task.title}
        </Typography>
      </Box>

      <IconButton onClick={deleteTask} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}