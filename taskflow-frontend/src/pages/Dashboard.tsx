
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProjectForm from "../components/ProjectForm";
import { createProject, getProjects } from "../services/projectApi";
import type { Project } from "../types/project";
import Navbar from "../components/NavBar";

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
                onClick={() => navigate(`/projects/${project._id}`)}
                className="cursor-pointer rounded-md bg-white p-4 shadow hover:shadow-md"
                >
                <h4 className="text-lg font-bold">
                    {project.name}
                </h4>

                <p className="mt-1 text-gray-600">
                    {project.description}
                </p>
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
