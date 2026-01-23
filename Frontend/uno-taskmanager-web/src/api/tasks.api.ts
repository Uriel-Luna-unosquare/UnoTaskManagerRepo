import api from "./axios";
import type { Task } from "../models/task.ts";

export async function getTasks(): Promise<Task[]> {
  const response = await api.get("/tasks");
  return response.data;
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
}

export async function createTask(task: Partial<Task>) {
  return api.post("/tasks", task);
}

export async function updateTask(id: string, task: Partial<Task>) {
  return api.put(`/tasks/${id}`, task);
}

export async function deleteTask(id: string) {
  return api.delete(`/tasks/${id}`);
}
