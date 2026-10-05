
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectForm from "../components/ProjectForm";
import { createProject, getProjects, updateProject, deleteProject } from "../services/projectApi";
import type { Project } from "../types/project";
import Navbar from "../components/NavBar";

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to get projects");
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = async (
    name: string,
    description: string
  ) => {
    const newProject = await createProject(name, description);

    setProjects((currentProjects) => [
      ...currentProjects,
      newProject,
    ]);
  };

  const handleEditProject = (project: Project) => {
  setEditingProjectId(project._id);
  setEditName(project.name);
  setEditDescription(project.description);
};

const handleProjectUpdated = async (projectId: string) => {
  try {
    const updatedProject = await updateProject(
      projectId,
      editName,
      editDescription
    );

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project._id === projectId ? updatedProject : project
      )
    );

    setEditingProjectId(null);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to update project");
    }
  }
};
const handleDeleteProject = async (projectId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteProject(projectId);

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project._id !== projectId)
    );
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to delete project");
    }
  }
};
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6">
          <ProjectForm
            onProjectCreated={handleProjectCreated}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold">
            My Projects
          </h3>

          {projects.length === 0 ? (
            <p className="mt-2 text-gray-600">
              No projects found.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
            {projects.map((project) => (
  <div
    key={project._id}
    className="rounded-md bg-white p-4 shadow"
  >
    {editingProjectId === project._id ? (
      <div className="space-y-3">
        <input
          type="text"
          value={editName}
          onChange={(event) => setEditName(event.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
        />

        <textarea
          value={editDescription}
          onChange={(event) =>
            setEditDescription(event.target.value)
          }
          rows={3}
          className="w-full rounded-md border border-gray-300 p-2"
        />

        <div className="flex gap-2">
          <button
            onClick={() => handleProjectUpdated(project._id)}
            className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            Save
          </button>

          <button
            onClick={() => setEditingProjectId(null)}
            className="rounded-md bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <>
        <div
          onClick={() => navigate(`/projects/${project._id}`)}
          className="cursor-pointer"
        >
          <h4 className="text-lg font-bold">
            {project.name}
          </h4>

          <p className="mt-1 text-gray-600">
            {project.description}
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => handleEditProject(project)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
          onClick={() => handleDeleteProject(project._id)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </>
    )}
  </div>
))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
