import httpClient from "./httpClient";
import type { Task } from "../models/task";

export async function getTasks(): Promise<Task[]> {
  const { data } = await httpClient.get<Task[]>("/tasks");
  return data;
}

export async function getTaskById(id: string): Promise<Task> {
  const { data } = await httpClient.get<Task>(`/tasks/${id}`);
  return data;
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const { data } = await httpClient.post<Task>("/tasks", task);
  return data;
}

export async function updateTask(id: string, task: Partial<Task>): Promise<void> {
  await httpClient.put(`/tasks/${id}`, task);
}

export async function deleteTask(id: string): Promise<void> {
  await httpClient.delete(`/tasks/${id}`);
}