import { useState } from "react";

interface TaskFormProps {
  onTaskCreated: (
    title: string,
    description: string,
    status: string,
    priority : string,
  ) => Promise<void>;
}

function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      await onTaskCreated(title, description, status, priority);

      setTitle("");
      setDescription("");
      setStatus("To Do");
      setPriority("Medium");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create task");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 space-y-4 rounded-xl border border-slate-200 border-t-4 border-t-blue-600 bg-white p-5 shadow-sm sm:p-6"
    >
      <h4 className="text-xl font-extrabold text-slate-900">
        Create New Task
      </h4>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        required
        rows={3}
        className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

        <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
    </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

export default TaskForm;

