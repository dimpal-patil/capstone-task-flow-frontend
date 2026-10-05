import { useState } from "react";

interface ProjectFormProps {
onProjectCreated: (
name: string,
description: string
) => Promise<void>;
}

function ProjectForm({ onProjectCreated }: ProjectFormProps) {
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (
event: React.FormEvent<HTMLFormElement>
) => {
event.preventDefault();
setError("");


try {
    setLoading(true);

    await onProjectCreated(name, description);

  setName("");
  setDescription("");
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Failed to create project"
  );
} finally {
  setLoading(false);
}


};

return ( <form
   onSubmit={handleSubmit}
  className="space-y-4 rounded-xl border border-slate-200 border-t-4 border-t-blue-600 bg-white p-5 shadow-sm sm:p-6"
 > <h3 className="text-xl font-semibold">
Create New Project </h3>

  {error && (
    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>
  )}

  <input
    type="text"
    placeholder="Project name"
    value={name}
    onChange={(event) => setName(event.target.value)}
    required
    className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />

  <textarea
    placeholder="Project description"
    value={description}
    onChange={(event) => setDescription(event.target.value)}
    required
    rows={3}
    className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />

  <button
    type="submit"
    disabled={loading}
    className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? "Creating..." : "Create Project"}
  </button>
</form>

);
}

export default ProjectForm;
