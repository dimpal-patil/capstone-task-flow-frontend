import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import {
  Button,
  Input,
  Select,
  Textarea,
  Badge,
  ErrorAlert,
} from "../components/ui/primitives";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../services/projectApi";
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

    //Get Projects
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
      const timeoutId = setTimeout(() => {
        fetchProjects();
      }, 300);

      return () => clearTimeout(timeoutId);
    }, [search]);

  //Create Project 
  const handleProjectCreated = async (name: string, description: string) => {
  const newProject = await createProject(name, description);
    setProjects((currentProjects) => [...currentProjects, newProject]);
    };

  //Edit Project 
  const handleEditProject = (project: Project) => {
      setEditingProjectId(project._id);
      setEditName(project.name);
      setEditDescription(project.description);
    };

  //Update Project
  const handleProjectUpdated = async (projectId: string) => {
      try {
        const currentProject = projects.find(
          (project) => project._id === projectId,
        );

        const updatedProject = await updateProject(
          projectId,
          editName,
          editDescription,
          currentProject?.status || "Active",
        );

        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project._id === projectId ? updatedProject : project,
          ),
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

  //Archive Project  
  const handleArchiveToggle = async (project: Project) => {
      const newStatus = project.status === "Archived" ? "Active" : "Archived";

      try {
        const updatedProject = await updateProject(
          project._id,
          project.name,
          project.description,
          newStatus,
        );

        setProjects((currentProjects) =>
          currentProjects.map((currentProject) =>
            currentProject._id === project._id ? updatedProject : currentProject,
          ),
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to update project status");
        }
      }
    };

  //Delete Project
  const handleDeleteProject = async (projectId: string) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this project?",
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteProject(projectId);

        setProjects((currentProjects) =>
          currentProjects.filter((project) => project._id !== projectId),
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to delete project");
        }
      }
    };

  //Delete Project
  const filteredProjects = projects.filter((project) => {
      return (
        projectStatusFilter === "All" || project.status === projectStatusFilter
      );
  });

return (
    <div className="min-h-screen bg-gradient-to-br from-brand-200 via-brand-50 to-indigo-200 dark:from-indigo-900 dark:via-slate-950 dark:to-violet-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          Workspace
        </p>
        <h2 className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">
          Dashboard
        </h2>

        <div className="mt-4 empty:hidden">
          <ErrorAlert message={error} />
        </div>

        <div className="mt-6">
          <ProjectForm onProjectCreated={handleProjectCreated} />
        </div>

        <section className="mt-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">My Projects</h3>

            <div className="flex flex-wrap gap-3">
              <Select
                value={projectStatusFilter}
                onChange={(event) => setProjectStatusFilter(event.target.value)}
              >
                <option value="Active">Active Projects</option>
                <option value="Archived">Archived Projects</option>
                <option value="All">All Projects</option>
              </Select>

              <Input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-64 py-2.5"
              />
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 px-6 py-12 text-center">
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                No projects found
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                Create a project above to get started.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredProjects.map((project) => (
                <article
                  key={project._id}
                  className="rounded-2xl border border-l-4 border-slate-200 border-l-brand-500 bg-white p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl sm:p-6 dark:border-slate-500 dark:border-l-brand-400 dark:bg-slate-900 dark:hover:border-slate-400 dark:hover:border-l-brand-400"
                >
                  {editingProjectId === project._id ? (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                      />

                      <Textarea
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                        rows={3}
                      />

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleProjectUpdated(project._id)}
                        >
                          Save
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingProjectId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="group block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2"
                      >
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white transition group-hover:text-brand-800 dark:group-hover:text-brand-300">
                          {project.name}
                        </h4>

                        <Badge
                          label={project.status}
                          className="mt-2 text-sm font-medium"
                        />

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {project.description}
                        </p>
                        <span className="mt-4 inline-flex text-sm font-bold text-brand-700 transition-all duration-200 group-hover:text-brand-900 group-hover:translate-x-1 dark:text-brand-300 dark:group-hover:text-brand-200">
                          View project details{" "}
                          <span className="ml-1" aria-hidden="true">
                            →
                          </span>
                        </span>
                      </button>

                      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                          onClick={() => handleEditProject(project)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          Delete
                        </Button>

                        <Button
                          size="sm"
                          variant={
                            project.status === "Archived"
                              ? "success"
                              : "warning"
                          }
                          onClick={() => handleArchiveToggle(project)}
                        >
                          {project.status === "Archived"
                            ? "Restore"
                            : "Archive"}
                        </Button>
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
