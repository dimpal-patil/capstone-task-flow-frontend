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
      className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h4 className="text-xl font-semibold text-gray-800">
        Create New Task
      </h4>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        required
        rows={3}
        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

        <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
    </select>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}

export default TaskForm;

