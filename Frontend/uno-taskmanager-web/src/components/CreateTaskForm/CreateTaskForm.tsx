import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { taskService } from "../../services/taskService";

type Props = {
  onTaskCreated: () => void;
};

export default function CreateTaskForm({ onTaskCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !dueDate) {
      setError("Title and due date are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await taskService.create({
        title,
        description,
        dueDate,
      });

      setTitle("");
      setDescription("");
      setDueDate("");

      onTaskCreated();
    } catch {
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mb={3}>
      <Typography variant="h6" gutterBottom>
        Create Task
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Due Date"
              value={dueDate ? dayjs(dueDate) : null}
              onChange={(newValue) => setDueDate(newValue ? newValue.format("YYYY-MM-DD") : "")}
              minDate={dayjs()}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  readOnly: true,
                },
              }}
            />
          </LocalizationProvider>

          {error && (
            <Typography color="error">{error}</Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
