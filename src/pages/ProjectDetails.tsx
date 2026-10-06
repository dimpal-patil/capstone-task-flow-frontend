import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import {
  Button,
  Input,
  Select,
  Textarea,
  Badge,
  ErrorAlert,
} from "../components/ui/primitives";
import { getProject } from "../services/projectApi";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/taskApi";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import TaskForm from "../components/TaskForm";

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
    priority: string,
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

    setTasks((currentTasks) => [...currentTasks, newTask]);
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
        currentTasks.map((task) => (task._id === taskId ? updatedTask : task)),
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
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId),
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
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });
  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const completionPercent = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-200 via-brand-50 to-indigo-200 dark:from-indigo-900 dark:via-slate-950 dark:to-violet-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-5 inline-flex items-center text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900 dark:text-brand-300 dark:hover:text-brand-200"
        >
          ← Back to Dashboard
        </button>
        <div className="mb-4 empty:mb-0">
          <ErrorAlert message={error} />
        </div>

        {project && (
          <>
            {/* Project Details */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 border-l-4 border-l-brand-600 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-lg sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
                Project
              </p>

              <h2 className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">
                {project.name}
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
                {project.description}
              </p>

              <div className="mt-7 max-w-3xl border-t border-slate-100 pt-5 dark:border-slate-700">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Project progress
                  </p>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {completedTasks} of {tasks.length} tasks complete
                    <span className="ml-2 text-brand-700 dark:text-brand-400">
                      {completionPercent}%
                    </span>
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-label="Project progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={completionPercent}
                  aria-valuetext={`${completedTasks} of ${tasks.length} tasks complete`}
                  className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Tasks Section */}
            <div className="mt-9">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-700 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Tasks
                </h3>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
                  {filteredTasks.length} task
                  {filteredTasks.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Filter tasks
                </p>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="min-h-11"
                  >
                    <option value="All">All Statuses</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value)}
                    className="min-h-11"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                  <Button
                    variant="secondary"
                    className="min-h-11 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                    onClick={() => {
                      setStatusFilter("All");
                      setPriorityFilter("All");
                    }}
                    disabled={
                      statusFilter === "All" && priorityFilter === "All"
                    }
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Create Task Form */}
              <TaskForm onTaskCreated={handleTaskCreated} />

              {/* Task List */}
              {filteredTasks.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 px-6 py-12 text-center">
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    No tasks found
                  </p>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                    Create a task above to start managing this project.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className={`rounded-2xl border border-l-4 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl sm:p-6 ${
                        task.status === "Done"
                          ? "border-l-emerald-500 dark:border-l-emerald-400"
                          : task.status === "In Progress"
                            ? "border-l-brand-500 dark:border-l-brand-400"
                            : "border-l-slate-300 dark:border-l-slate-700"
                      }`}
                    >
                      {editingTaskId === task._id ? (
                        <div className="space-y-3">
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                            Edit Task
                          </h4>
                          <Input
                            type="text"
                            value={editTitle}
                            onChange={(event) =>
                              setEditTitle(event.target.value)
                            }
                          />

                          <Textarea
                            value={editDescription}
                            onChange={(event) =>
                              setEditDescription(event.target.value)
                            }
                            rows={3}
                          />

                          <Select
                            value={editStatus}
                            onChange={(event) =>
                              setEditStatus(event.target.value)
                            }
                            className="w-full p-3 text-sm"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </Select>

                          <Select
                            value={editPriority}
                            onChange={(event) =>
                              setEditPriority(event.target.value)
                            }
                            className="w-full p-3 text-sm"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </Select>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleTaskUpdated(task._id)}
                            >
                              Save
                            </Button>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingTaskId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                {task.title}
                              </h4>

                              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {task.description}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <Badge label={task.status} />
                                <Badge label={task.priority} tone="priority" />
                              </div>
                            </div>
                            <div className="flex shrink-0 gap-2 self-start">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                                onClick={() => handleEditClick(task)}
                              >
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDeleteTask(task._id)}
                              >
                                Delete
                              </Button>
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
