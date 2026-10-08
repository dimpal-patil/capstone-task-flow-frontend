import type { Task } from "../types/task";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

//Get Tasks
export const getTasks = async (projectId: string): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get tasks");
  }

  return data.tasks;
};

//Create Task
export const createTask = async (
  projectId: string,
  title: string,
  description: string,
  status: string,
  priority: string,
): Promise<Task> => {
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title,
      description,
      status,
      priority,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data.task;
};

//Update Task
export const updateTask = async (
  taskId: string,
  title: string,
  description: string,
  status: string,
  priority: string,
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title,
      description,
      status,
      priority,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }

  return data.task;
};

//Delete Task
export const deleteTask = async (taskId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task");
  }
};
