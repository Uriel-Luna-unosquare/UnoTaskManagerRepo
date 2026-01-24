import { Stack } from "@mui/material";
import type { Task } from "../models/task";
import TaskItem from "./TaskItem.tsx";

type Props = {
  tasks: Task[];
  onChanged: () => void;
};

export default function TaskList({ tasks, onChanged }: Props) {
  return (
    <Stack spacing={1}>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onChanged={onChanged}
        />
      ))}
    </Stack>
  );
}
