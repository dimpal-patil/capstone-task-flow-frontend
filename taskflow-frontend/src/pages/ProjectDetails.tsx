
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getProject } from "../services/projectApi";
import { createTask, getTasks } from "../services/taskApi";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import TaskForm from "../components/TaskForm";

function ProjectDetails() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      if (!projectId) {
        return;
      }

      try {
        const projectData = await getProject(projectId);
        setProject(projectData);

        const taskData = await getTasks(projectId);
        setTasks(taskData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to load project");
        }
      }
    };

    fetchProjectAndTasks();
  }, [projectId]);

  const handleTaskCreated = async (
    title: string,
    description: string,
    status: string
  ) => {
    if (!projectId) {
      return;
    }

    const newTask = await createTask(
      projectId,
      title,
      description,
      status
    );

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {project && (
          <>
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-3xl font-bold">
                {project.name}
              </h2>

              <p className="mt-3 text-gray-600">
                {project.description}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold">
                Tasks
              </h3>

              <TaskForm
                onTaskCreated={handleTaskCreated}
              />

              {tasks.length === 0 ? (
                <p className="mt-4 text-gray-600">
                  No tasks found.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      className="rounded-lg bg-white p-4 shadow"
                    >
                      <h4 className="text-lg font-bold">
                        {task.title}
                      </h4>

                      <p className="mt-1 text-gray-600">
                        {task.description}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Status: {task.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ProjectDetails;

