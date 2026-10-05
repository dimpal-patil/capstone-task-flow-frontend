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
   className="space-y-4 rounded-lg bg-white p-6 shadow"
 > <h3 className="text-xl font-semibold">
Create New Project </h3>

  {error && (
    <p className="text-sm text-red-600">{error}</p>
  )}

  <input
    type="text"
    placeholder="Project name"
    value={name}
    onChange={(event) => setName(event.target.value)}
    required
    className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <textarea
    placeholder="Project description"
    value={description}
    onChange={(event) => setDescription(event.target.value)}
    required
    rows={3}
    className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="submit"
    disabled={loading}
    className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
  >
    {loading ? "Creating..." : "Create Project"}
  </button>
</form>

);
}

export default ProjectForm;
