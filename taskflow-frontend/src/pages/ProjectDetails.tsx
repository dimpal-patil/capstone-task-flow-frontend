
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getProject } from "../services/projectApi";
import { createTask, getTasks, updateTask, deleteTask} from "../services/taskApi";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import TaskForm from "../components/TaskForm";

function ProjectDetails() {
  const { projectId } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("To Do");

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

  const handleEditClick = (task: Task) => {
      setEditingTaskId(task._id);
      setEditTitle(task.title);
      setEditDescription(task.description);
      setEditStatus(task.status);
    };

    const handleTaskUpdated = async (taskId: string) => {
  try {
    const updatedTask = await updateTask(
      taskId,
      editTitle,
      editDescription,
      editStatus
    );

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId ? updatedTask : task
      )
    );

    setEditingTaskId(null);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to update task");
    }
  }
};

const handleDeleteTask = async (taskId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteTask(taskId);

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task._id !== taskId)
    );
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("Failed to delete task");
    }
  }
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
            {/* Project Details */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-3xl font-bold">
                {project.name}
              </h2>

              <p className="mt-3 text-gray-600">
                {project.description}
              </p>
            </div>

            {/* Tasks Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold">
                Tasks
              </h3>

              {/* Create Task Form */}
              <TaskForm
                onTaskCreated={handleTaskCreated}
              />

              {/* Task List */}
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
              {editingTaskId === task._id ? (
  <div className="space-y-3">
    <input
      type="text"
      value={editTitle}
      onChange={(event) => setEditTitle(event.target.value)}
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

    <select
      value={editStatus}
      onChange={(event) => setEditStatus(event.target.value)}
      className="w-full rounded-md border border-gray-300 p-2"
    >
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>

    <div className="flex gap-2">
      <button 
      onClick={() => handleTaskUpdated(task._id)}
        className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
      >
        Save
      </button>

      <button
        onClick={() => setEditingTaskId(null)}
        className="rounded-md bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <>
    <h4 className="text-lg font-bold">
      {task.title}
    </h4>

    <p className="mt-1 text-gray-600">
      {task.description}
    </p>

    <p className="mt-2 text-sm text-gray-500">
      Status: {task.status}
    </p>

    <div className="mt-4 flex gap-2">
      <button
        onClick={() => handleEditClick(task)}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Edit
      </button>

      <button
      onClick={() => handleDeleteTask(task._id)}
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
          </>
        )}
      </main>
    </div>
  );
}

export default ProjectDetails;
