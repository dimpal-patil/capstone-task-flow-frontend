
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
const completedTasks = tasks.filter((task) => task.status === "Done").length;
const completionPercent = tasks.length
  ? Math.round((completedTasks / tasks.length) * 100)
  : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-5 inline-flex items-center text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          ← Back to Dashboard
        </button>
        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {project && (
          <>
           {/* Project Details */}
          <section className="overflow-hidden rounded-xl border border-slate-200 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Project
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {project.name}
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              {project.description}
            </p>

            <div className="mt-7 max-w-3xl border-t border-slate-100 pt-5">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800">Project progress</p>
                <p className="text-sm font-semibold text-slate-600">
                  {completedTasks} of {tasks.length} tasks complete
                  <span className="ml-2 text-blue-700">{completionPercent}%</span>
                </p>
              </div>
              <div
                role="progressbar"
                aria-label="Project progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercent}
                aria-valuetext={`${completedTasks} of ${tasks.length} tasks complete`}
                className="h-2.5 overflow-hidden rounded-full bg-slate-100"
              >
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </section>

            {/* Tasks Section */}
            <div className="mt-9">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Tasks
                </h3>

                <span className="text-sm font-medium text-slate-500">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Filter tasks
                </p>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
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
                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <p className="text-lg font-bold text-slate-800">
                    No tasks found
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Create a task above to start managing this project.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {filteredTasks.map((task) => (
                <div
                    key={task._id}
                    className={`rounded-xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md sm:p-6 ${
                      task.status === "Done"
                        ? "border-l-emerald-500"
                        : task.status === "In Progress"
                          ? "border-l-blue-500"
                          : "border-l-slate-300"
                    }`}
                >
              {editingTaskId === task._id ? (
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-slate-900">
            Edit Task
          </h4>
        <input
          type="text"
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
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

    <select
      value={editStatus}
      onChange={(event) => setEditStatus(event.target.value)}
      className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Done">Done</option>
    </select>

    <select
      value={editPriority}
      onChange={(event) => setEditPriority(event.target.value)}
      className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>

    <div className="flex gap-2">
      <button 
      onClick={() => handleTaskUpdated(task._id)}
        className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
      >
        Save
      </button>

      <button
        onClick={() => setEditingTaskId(null)}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Cancel
      </button>
    </div>
  </div>
) : (
  <>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
    <h4 className="text-lg font-bold text-slate-900">
      {task.title}
    </h4>

    <p className="mt-1 text-sm leading-6 text-slate-600">
      {task.description}
    </p>

    <div className="mt-3 flex flex-wrap gap-2">
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClasses(
          task.status
        )}`}
      >
        {task.status}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${getPriorityClasses(
          task.priority
        )}`}
      >
        Priority: {task.priority}
      </span>
    </div>

    </div>
    <div className="flex shrink-0 gap-2 self-start">
      <button
        onClick={() => handleEditClick(task)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        Edit
      </button>

      <button
      onClick={() => handleDeleteTask(task._id)}
        className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
      >
        Delete
      </button>
    </div>
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
