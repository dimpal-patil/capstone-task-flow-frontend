import type { Project } from "../types/project";

const API_URL = "http://localhost:3000/api/projects";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getProjects = async (search = ""): Promise<Project[]> => {
  const url = search
    ? `${API_URL}?search=${encodeURIComponent(search)}`
    : API_URL;

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
  const response = await fetch(API_URL, {
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
  const response = await fetch(`${API_URL}/${projectId}`, {
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
  const response = await fetch(`${API_URL}/${projectId}`, {
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
  const response = await fetch(`${API_URL}/${projectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete project");
  }
};
