"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  difficulty_level: string | null;
  image_url: string | null;
  display_order: number;
}

interface ProjectWithSkills {
  project: Project;
  skills: { id: string; name: string }[] | null;
}

export default function ProjectsEditor() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<ProjectWithSkills[]>([]);
  const [availableSkills, setAvailableSkills] = useState<
    { id: string; name: string; category: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Project>>({});
  const [editingSkills, setEditingSkills] = useState<string[]>([]);
  const [newProjectSkills, setNewProjectSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState<Partial<Project>>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchSkills();
  }, []);

  const fetchProjects = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/projects`);
      const data = await response.json();

      // Ensure we have valid data structure
      const projectsList = Array.isArray(data?.data)
        ? data.data.map((item: any) => ({
            project: item?.project || {},
            skills: Array.isArray(item?.skills) ? item.skills : [],
          }))
        : [];

      setProjects(projectsList);
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/skills`);
      const data = await response.json();
      setAvailableSkills(data.data || []);
    } catch (err) {
      console.error("Failed to load skills:", err);
    }
  };

  const startEditing = (projectWithSkills: ProjectWithSkills) => {
    const project = projectWithSkills.project;
    const skills = projectWithSkills.skills || [];

    setEditingProject(project.id);
    setEditForm({
      name: project.name,
      slug: project.slug,
      short_description: project.short_description,
      full_description: project.full_description,
      status: project.status,
      github_url: project.github_url,
      live_url: project.live_url,
      featured: project.featured,
      difficulty_level: project.difficulty_level,
    });
    setEditingSkills(skills.map((s) => s.id));
    setError(null);
    setSuccessMessage(null);
  };

  const cancelEditing = () => {
    setEditingProject(null);
    setEditForm({});
    setEditingSkills([]);
  };

  const startCreating = () => {
    setCreating(true);
    setNewProjectForm({
      name: "",
      slug: "",
      short_description: "",
      full_description: "",
      status: "active",
      featured: false,
      difficulty_level: "intermediate",
      display_order: 0,
    });
    setNewProjectSkills([]);
    setError(null);
    setSuccessMessage(null);
  };

  const cancelCreating = () => {
    setCreating(false);
    setNewProjectForm({});
    setNewProjectSkills([]);
  };

  const saveProject = async (projectId: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setSaving(projectId);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Update project details
      const response = await fetch(
        `${apiUrl}/api/v1/admin/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editForm,
            skill_ids: editingSkills,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      const result = await response.json();
      const updatedProject = result.data || result;

      // Refresh projects to get updated skills
      await fetchProjects();

      setSuccessMessage("Project updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setEditingProject(null);
      setEditForm({});
      setEditingSkills([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const createProject = async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!newProjectForm.name || !newProjectForm.slug) {
      setError("Name and slug are required");
      return;
    }

    setSaving("new");
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/v1/admin/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProjectForm,
          skill_ids: newProjectSkills,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create project");
      }

      const result = await response.json();
      const createdProject = result.data;

      // Refresh projects to get updated skills
      await fetchProjects();

      setSuccessMessage("Project created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setCreating(false);
      setNewProjectForm({});
      setNewProjectSkills([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(projectId);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(
        `${apiUrl}/api/v1/admin/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      // Remove from local state
      setProjects((prev) =>
        prev.filter((item) => item.project.id !== projectId)
      );

      setSuccessMessage("Project deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const uploadImage = async (projectId: string, file: File) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setUploadingImage(projectId);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${apiUrl}/api/v1/admin/projects/${projectId}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();

      // Update the project in local state with new image_url
      setProjects((prev) =>
        prev.map((item) =>
          item.project.id === projectId
            ? {
                ...item,
                project: { ...item.project, image_url: data.image_url },
              }
            : item
        )
      );

      setSuccessMessage("Image uploaded successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setSelectedImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      console.error(err);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    projectId: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      uploadImage(projectId, file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading projects...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400">Not authenticated</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Projects</h1>
        <p className="text-gray-400">
          Create, update, and manage your portfolio projects
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Create New Project Button */}
      {!creating && (
        <button
          onClick={startCreating}
          className="w-full px-4 py-3 bg-green-900/20 hover:bg-green-900/30 text-green-300 rounded-lg transition-colors text-sm font-medium border border-green-900/50"
        >
          + Create New Project
        </button>
      )}

      {/* Create New Project Form */}
      {creating && (
        <div className="bg-[#1a0a0f] rounded-lg border border-green-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Create New Project
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProjectForm.name || ""}
                  onChange={(e) =>
                    setNewProjectForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={newProjectForm.slug || ""}
                  onChange={(e) =>
                    setNewProjectForm((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="my-awesome-project"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Short Description
              </label>
              <input
                type="text"
                value={newProjectForm.short_description || ""}
                onChange={(e) =>
                  setNewProjectForm((prev) => ({
                    ...prev,
                    short_description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                placeholder="Brief one-liner description"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Full Description
              </label>
              <textarea
                value={newProjectForm.full_description || ""}
                onChange={(e) =>
                  setNewProjectForm((prev) => ({
                    ...prev,
                    full_description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent resize-none"
                placeholder="Detailed project description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={newProjectForm.github_url || ""}
                  onChange={(e) =>
                    setNewProjectForm((prev) => ({
                      ...prev,
                      github_url: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Live URL
                </label>
                <input
                  type="url"
                  value={newProjectForm.live_url || ""}
                  onChange={(e) =>
                    setNewProjectForm((prev) => ({
                      ...prev,
                      live_url: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newProjectForm.status || "active"}
                  onChange={(e) =>
                    setNewProjectForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="in-progress">In Progress</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={newProjectForm.difficulty_level || "intermediate"}
                  onChange={(e) =>
                    setNewProjectForm((prev) => ({
                      ...prev,
                      difficulty_level: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Featured
                </label>
                <div className="flex items-center h-[42px]">
                  <input
                    type="checkbox"
                    checked={newProjectForm.featured || false}
                    onChange={(e) =>
                      setNewProjectForm((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 bg-gray-900 border border-gray-800 rounded focus:ring-2 focus:ring-green-900"
                  />
                  <span className="ml-2 text-gray-400">Show on homepage</span>
                </div>
              </div>
            </div>

            {/* Skills Selector */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Skills</label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-900 border border-gray-800 rounded-lg">
                {availableSkills.map((skill) => (
                  <label
                    key={skill.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={newProjectSkills.includes(skill.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewProjectSkills((prev) => [...prev, skill.id]);
                        } else {
                          setNewProjectSkills((prev) =>
                            prev.filter((id) => id !== skill.id)
                          );
                        }
                      }}
                      className="w-4 h-4 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-green-900"
                    />
                    <span className="text-sm text-gray-300">{skill.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {newProjectSkills.length} skill(s) selected
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={createProject}
                disabled={saving === "new"}
                className="flex-1 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                {saving === "new" ? "Creating..." : "Create Project"}
              </button>
              <button
                onClick={cancelCreating}
                disabled={saving === "new"}
                className="flex-1 px-4 py-2 bg-gray-900/30 hover:bg-gray-900/50 text-gray-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-[#1a0a0f] rounded-lg p-12 border border-gray-800 text-center">
          <div className="text-gray-400">No projects found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map(({ project, skills }) => {
            const isEditing = editingProject === project.id;
            const isSaving = saving === project.id;
            const isDeleting = deleting === project.id;

            return (
              <div
                key={project.id}
                className={`bg-[#1a0a0f] rounded-lg border transition-all ${
                  isEditing
                    ? "border-blue-700 shadow-lg shadow-blue-900/20"
                    : "border-gray-800"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {project.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{project.slug}</p>
                      {project.featured && (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded text-xs">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => startEditing({ project, skills })}
                            className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => saveProject(project.id)}
                            disabled={isSaving}
                            className="px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="px-4 py-2 bg-gray-900/30 hover:bg-gray-900/50 text-gray-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  {!isEditing ? (
                    <div className="space-y-3 text-sm">
                      {project.short_description && (
                        <p className="text-gray-300">
                          {project.short_description}
                        </p>
                      )}
                      <div className="flex gap-4 text-gray-400">
                        <span>Status: {project.status}</span>
                        {project.difficulty_level && (
                          <span>Difficulty: {project.difficulty_level}</span>
                        )}
                      </div>
                      {(project.github_url || project.live_url) && (
                        <div className="flex gap-3">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline text-sm"
                            >
                              GitHub →
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline text-sm"
                            >
                              Live Demo →
                            </a>
                          )}
                        </div>
                      )}
                      {skills && skills.length > 0 && (
                        <div>
                          <span className="text-gray-400">Skills: </span>
                          {skills.map((skill) => skill.name).join(", ")}
                        </div>
                      )}

                      {/* Image Upload */}
                      <div className="border-t border-gray-800 pt-3 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">
                            Project Image:
                          </span>
                          {project.image_url ? (
                            <div className="flex items-center gap-3">
                              <a
                                href={project.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline text-sm"
                              >
                                View Image →
                              </a>
                              <label className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded cursor-pointer text-xs">
                                {uploadingImage === project.id
                                  ? "Uploading..."
                                  : "Change Image"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageSelect(e, project.id)
                                  }
                                  disabled={uploadingImage === project.id}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded cursor-pointer text-xs">
                              {uploadingImage === project.id
                                ? "Uploading..."
                                : "Upload Image"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageSelect(e, project.id)
                                }
                                disabled={uploadingImage === project.id}
                              />
                            </label>
                          )}
                        </div>
                        {project.image_url && (
                          <img
                            src={project.image_url}
                            alt={project.name}
                            className="mt-2 rounded-lg max-w-xs max-h-48 object-cover border border-gray-800"
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editForm.name || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Slug
                          </label>
                          <input
                            type="text"
                            value={editForm.slug || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                slug: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Short Description
                        </label>
                        <input
                          type="text"
                          value={editForm.short_description || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              short_description: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Full Description
                        </label>
                        <textarea
                          value={editForm.full_description || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              full_description: e.target.value,
                            }))
                          }
                          rows={4}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            value={editForm.github_url || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                github_url: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Live URL
                          </label>
                          <input
                            type="url"
                            value={editForm.live_url || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                live_url: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Status
                          </label>
                          <select
                            value={editForm.status || "active"}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                status: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="in-progress">In Progress</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Difficulty
                          </label>
                          <select
                            value={editForm.difficulty_level || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                difficulty_level: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          >
                            <option value="">None</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Featured
                          </label>
                          <div className="flex items-center h-[42px]">
                            <input
                              type="checkbox"
                              checked={editForm.featured || false}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  featured: e.target.checked,
                                }))
                              }
                              className="w-5 h-5 bg-gray-900 border border-gray-800 rounded focus:ring-2 focus:ring-blue-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Skills Selector */}
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Skills
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-900 border border-gray-800 rounded-lg">
                          {availableSkills.map((skill) => (
                            <label
                              key={skill.id}
                              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={editingSkills.includes(skill.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditingSkills((prev) => [
                                      ...prev,
                                      skill.id,
                                    ]);
                                  } else {
                                    setEditingSkills((prev) =>
                                      prev.filter((id) => id !== skill.id)
                                    );
                                  }
                                }}
                                className="w-4 h-4 bg-gray-900 border border-gray-700 rounded focus:ring-2 focus:ring-blue-900"
                              />
                              <span className="text-sm text-gray-300">
                                {skill.name}
                              </span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {editingSkills.length} skill(s) selected
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
