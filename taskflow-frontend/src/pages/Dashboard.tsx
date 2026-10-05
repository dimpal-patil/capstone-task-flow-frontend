
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
  const [search, setSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("Active");

  const fetchProjects = async () => {
    try {
      const data = await getProjects(search);
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
  }, [search]);

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
    const currentProject = projects.find(
      (project) => project._id === projectId
    );

    const updatedProject = await updateProject(
      projectId,
      editName,
      editDescription,
      currentProject?.status || "Active"
    );

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project._id === projectId
          ? updatedProject
          : project
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

const handleArchiveToggle = async (project: Project) => {
  const newStatus =
    project.status === "Archived" ? "Active" : "Archived";

  try {
    const updatedProject = await updateProject(
      project._id,
      project.name,
      project.description,
      newStatus
    );

    setProjects((currentProjects) =>
      currentProjects.map((currentProject) =>
        currentProject._id === project._id
          ? updatedProject
          : currentProject
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to update project status");
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

const filteredProjects = projects.filter((project) => {
  return (
    projectStatusFilter === "All" ||
    project.status === projectStatusFilter
  );
});
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
          Workspace
        </p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Dashboard
        </h2>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6">
          <ProjectForm
            onProjectCreated={handleProjectCreated}
          />
        </div>

        <section className="mt-9">
         <div className="flex flex-wrap items-center justify-between gap-3">
  <h3 className="text-xl font-semibold">
    My Projects
  </h3>

  <div className="flex flex-wrap gap-3">
    <select
      value={projectStatusFilter}
      onChange={(event) =>
        setProjectStatusFilter(event.target.value)
      }
      className="rounded-md border border-gray-300 bg-white p-2"
    >
      <option value="Active">Active Projects</option>
      <option value="Archived">Archived Projects</option>
      <option value="All">All Projects</option>
    </select>

    <input
      type="text"
      placeholder="Search projects..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      className="w-64 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>

          {projects.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-lg font-bold text-slate-800">No projects found</p>
              <p className="mt-2 text-sm text-slate-500">
                Create a project above to get started.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredProjects.map((project) => (
  <article
    key={project._id}
    className="rounded-xl border border-l-4 border-slate-200 border-l-blue-500 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-6"
  >
    {editingProjectId === project._id ? (
      <div className="space-y-3">
        <input
          type="text"
          value={editName}
          onChange={(event) => setEditName(event.target.value)}
          className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <textarea
          value={editDescription}
          onChange={(event) =>
            setEditDescription(event.target.value)
          }
          rows={3}
          className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="flex gap-2">
          <button
            onClick={() => handleProjectUpdated(project._id)}
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Save
          </button>

          <button
            onClick={() => setEditingProjectId(null)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <>
        <button
          type="button"
          onClick={() => navigate(`/projects/${project._id}`)}
          className="group block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
        >
          <h4 className="text-xl font-bold text-slate-900 transition group-hover:text-blue-800">
            {project.name}
          </h4>

            <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    project.status === "Archived"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-green-100 text-green-700"
                }`}
                >
                {project.status}
            </span>


          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {project.description}
          </p>
          <span className="mt-4 inline-flex text-sm font-bold text-blue-700 transition group-hover:translate-x-1">
            View project details <span className="ml-1" aria-hidden="true">→</span>
          </span>
        </button>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => handleEditProject(project)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Edit
          </button>

          <button
          onClick={() => handleDeleteProject(project._id)}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            Delete
          </button>
          <button
            onClick={() => handleArchiveToggle(project)}
            className={
                project.status === "Archived"
                ? "rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                : "rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            }
            >
            {project.status === "Archived" ? "Restore" : "Archive"}
            </button>
        </div>
      </>
    )}
  </article>
))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
