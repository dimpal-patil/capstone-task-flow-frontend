import { useState } from "react";
import { Button, Input, Select, Textarea, ErrorAlert } from "./ui/primitives";

interface TaskFormProps {
  onTaskCreated: (
    title: string,
    description: string,
    status: string,
    priority: string,
  ) => Promise<void>;
}

function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
      className="mt-5 space-y-4 rounded-2xl border border-slate-200 border-t-4 border-t-brand-600 bg-white dark:border-slate-700 dark:bg-slate-900 p-5 shadow-lg sm:p-6"
    >
      <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
        Create New Task
      </h4>

      <ErrorAlert message={error} />

      <Input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <Textarea
        placeholder="Task description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
        rows={3}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="w-full p-3"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </Select>

        <Select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="w-full p-3"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}

export default TaskForm;
