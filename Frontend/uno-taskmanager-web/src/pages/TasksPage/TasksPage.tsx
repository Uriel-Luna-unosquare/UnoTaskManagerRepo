import { useEffect, useState } from "react";
import { Box, Typography, Card, CircularProgress, IconButton } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { taskService } from "../../services/taskService";
import type { Task } from "../../models/task";
import CreateTaskForm from "../../components/CreateTaskForm";
import {
  tasksContainerStyles,
  tasksHeaderStyles,
  tasksTitleStyles,
  tasksSubtitleStyles,
  createTaskCardStyles,
  loadingBoxStyles,
  errorCardStyles,
  errorTextStyles,
  emptyStateCardStyles,
  emptyStateTextStyles,
  tasksGridStyles,
  taskCardStyles,
  taskTitleStyles,
} from "./TasksPage.styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate.split("T")[0]);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;
    await taskService.update(editingTask.id, {
      ...editingTask,
      title: editTitle,
      dueDate: editDueDate,
    });
    setEditingTask(null);
    loadTasks();
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setTasks(await taskService.getAll());
    } catch {
      setError("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleToggleTask = async (task: Task) => {
    await taskService.update(task.id, { ...task, isCompleted: !task.isCompleted });
    loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await taskService.remove(id);
    loadTasks();
  };

  return (
    <Box sx={tasksContainerStyles}>
      <Box sx={{ px: 3, width: "100%" }}>
        <Box sx={tasksHeaderStyles}>
          <Typography variant="h3" sx={tasksTitleStyles}>My Tasks</Typography>
          <Typography variant="body1" sx={tasksSubtitleStyles}>Stay organized and track your progress</Typography>
        </Box>

        <Card sx={createTaskCardStyles}>
          <CreateTaskForm onTaskCreated={loadTasks} />
        </Card>

        {loading && <Box sx={loadingBoxStyles}><CircularProgress sx={{ color: "#667eea" }} /></Box>}
        
        {error && <Card sx={errorCardStyles}><Typography sx={errorTextStyles}>{error}</Typography></Card>}
        
        {!loading && tasks.length === 0 && (
          <Card sx={emptyStateCardStyles}>
            <Typography variant="h6" sx={emptyStateTextStyles}>No tasks yet. Create one to get started! 🚀</Typography>
          </Card>
        )}

        {!loading && tasks.length > 0 && (
          <Box sx={tasksGridStyles}>
            {tasks.map(task => (
              <Card key={task.id} sx={taskCardStyles(task.isCompleted)}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" flexDirection="column" gap={0.5} onClick={() => handleToggleTask(task)} sx={{ cursor: "pointer", flex: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography sx={taskTitleStyles(task.isCompleted)}>{task.title}</Typography>
                      {task.isCompleted && <Typography>✅</Typography>}
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <IconButton size="small" onClick={() => handleEditClick(task)} sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteTask(task.id)} sx={{ opacity: 0.6, "&:hover": { opacity: 1 } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
      <Dialog open={!!editingTask} onClose={() => setEditingTask(null)}>
  <DialogTitle>Edit Task</DialogTitle>

  <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
    <TextField
      label="Title"
      value={editTitle}
      onChange={e => setEditTitle(e.target.value)}
      fullWidth
    />

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Due Date"
        value={editDueDate ? dayjs(editDueDate) : null}
        onChange={(newValue) => setEditDueDate(newValue ? newValue.format("YYYY-MM-DD") : "")}
        minDate={dayjs()}
        slotProps={{
          textField: {
            fullWidth: true,
            readOnly: true,
          },
        }}
      />
    </LocalizationProvider>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setEditingTask(null)}>Cancel</Button>
    <Button variant="contained" onClick={handleSaveEdit}>
      Save
    </Button>
  </DialogActions>
</Dialog>
    </Box>
    
  );
}