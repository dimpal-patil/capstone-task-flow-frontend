
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { getProject } from "../services/projectApi";
import { createTask, getTasks, updateTask, deleteTask} from "../services/taskApi";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import TaskForm from "../components/TaskForm";


const getStatusClasses = (status: string) => {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-700";

    case "In Progress":
      return "bg-blue-100 text-blue-700";

    case "To Do":
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityClasses = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";

    case "Medium":
      return "bg-yellow-100 text-yellow-700";

    case "Low":
    default:
      return "bg-gray-100 text-gray-700";
  }
};

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("To Do");
  const [editPriority, setEditPriority] = useState("Medium");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

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
    status: string,
    priority : string,
  ) => {
    if (!projectId) {
      return;
    }

    const newTask = await createTask(
      projectId,
      title,
      description,
      status,
      priority,
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
      setEditPriority(task.priority);
    };

    const handleTaskUpdated = async (taskId: string) => {
  try {
    const updatedTask = await updateTask(
      taskId,
      editTitle,
      editDescription,
      editStatus,
      editPriority,
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

const filteredTasks = tasks.filter((task) => {
  const matchesStatus =
    statusFilter === "All" ||
    task.status === statusFilter;

  const matchesPriority =
    priorityFilter === "All" ||
    task.priority === priorityFilter;

  return matchesStatus && matchesPriority;
});

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-6xl p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Dashboard
        </button>
        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {project && (
          <>
           {/* Project Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              Project
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-800">
              {project.name}
            </h2>

            <p className="mt-3 leading-6 text-gray-600">
              {project.description}
            </p>
          </div>

            {/* Tasks Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  Tasks
                </h3>

                <span className="text-sm text-gray-500">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Filter tasks
                </p>

        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-gray-300 bg-white p-2"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="rounded-md border border-gray-300 bg-white p-2"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
      </select>
      <button
        onClick={() => {
          setStatusFilter("All");
          setPriorityFilter("All");
        }}
        disabled={statusFilter === "All" && priorityFilter === "All"}
        className="rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear Filters
      </button>
  </div>
  </div>

              {/* Create Task Form */}
              <TaskForm
                onTaskCreated={handleTaskCreated}
              />

              {/* Task List */}
              {filteredTasks.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
                  <p className="text-lg font-medium text-gray-700">
                    No tasks found
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Create a task above to start managing this project.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {filteredTasks.map((task) => (
                <div
                    key={task._id}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
              {editingTaskId === task._id ? (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">
            Edit Task
          </h4>
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

    <select
      value={editPriority}
      onChange={(event) => setEditPriority(event.target.value)}
      className="w-full rounded-md border border-gray-300 p-2"
      >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
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

    <div className="mt-3 flex flex-wrap gap-2">
      <span
        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(
          task.status
        )}`}
      >
        {task.status}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-sm font-medium ${getPriorityClasses(
          task.priority
        )}`}
      >
        Priority: {task.priority}
      </span>
    </div>

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
