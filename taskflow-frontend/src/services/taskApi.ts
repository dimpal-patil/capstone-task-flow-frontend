
import type { Task } from "../types/task";

const API_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getTasks = async (
  projectId: string
): Promise<Task[]> => {
  const response = await fetch(
    `${API_URL}/projects/${projectId}/tasks`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get tasks");
  }

  return data.tasks;
};

export const createTask = async (
  projectId: string,
  title: string,
  description: string,
  status: string,
  priority : string,
): Promise<Task> => {
  const response = await fetch(
    `${API_URL}/projects/${projectId}/tasks`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.task;
};

export const updateTask = async (
  taskId: string,
  title: string,
  description: string,
  status: string,
  priority : string,
): Promise<Task> => {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }

  return data.task;
};

export const deleteTask = async (
  taskId: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/tasks/${taskId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task");
  }
};

