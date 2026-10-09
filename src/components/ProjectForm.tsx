import { useState } from "react";
import { Button, Input, Textarea, ErrorAlert } from "./ui/primitives";
interface ProjectFormProps {
  onProjectCreated: (name: string, description: string) => Promise<void>;
}

function ProjectForm({ onProjectCreated }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      await onProjectCreated(name, description);
      setName("");
      setDescription("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create project",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 border-t-4 border-t-brand-600 bg-white p-5 shadow-lg sm:p-6 dark:border-slate-500 dark:border-t-brand-400 dark:bg-slate-900"
    >
      <h3 className="text-xl font-semibold">Create New Project</h3>

      <ErrorAlert message={error} />

      <Input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <Textarea
        placeholder="Project description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
        rows={3}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}

export default ProjectForm;
