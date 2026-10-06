import type { Project } from "../types/project";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getProjects = async (search = ""): Promise<Project[]> => {
  const url = search
  ? `${API_URL}/projects?search=${encodeURIComponent(search)}`
  : `${API_URL}/projects`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get projects");
  }

  return data.projects;
};

export const createProject = async (
  name: string,
  description: string,
): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name,
      description,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data.project;
};

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get project");
  }

  return data.project;
};

export const updateProject = async (
  projectId: string,
  name: string,
  description: string,
  status: string,
): Promise<Project> => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name,
      description,
      status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update project");
  }

  return data.project;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete project");
  }
};
