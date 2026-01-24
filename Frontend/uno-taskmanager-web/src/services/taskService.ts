import httpClient from "../api/httpClient.ts";
import type { Task } from "../models/task.ts";

export type CreateTaskPayload = {
  title: string;
  description?: string;
  dueDate: string;
};

export type UpdateTaskPayload = {
  title: string;
  description?: string;
  dueDate: string;
  isCompleted?: boolean;
};

export const taskService = {
  async getAll(): Promise<Task[]> {
    const { data } = await httpClient.get<Task[]>("tasks");
    return data;
  },

  async getById(id: string): Promise<Task> {
    const { data } = await httpClient.get<Task>(`/tasks/${id}`);
    return data;
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const { data } = await httpClient.post<Task>("/tasks", payload);
    return data;
  },

  async update(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const { data } = await httpClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/tasks/${id}`);
  },
};
