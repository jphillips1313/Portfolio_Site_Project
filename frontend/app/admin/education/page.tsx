"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  grade: string | null;
  description: string | null;
  slug: string;
  display_order: number;
}

export default function EducationEditor() {
  const { token } = useAuth();
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Education>>({});
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<Partial<Education>>({
    degree: "",
    institution: "",
    field_of_study: "",
    start_date: "",
    end_date: null,
    grade: "",
    description: "",
    slug: "",
    display_order: 0,
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/education`);
      const data = await response.json();
      setEducationList(data.data || []);
    } catch (err) {
      setError("Failed to load education data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (edu: Education) => {
    setEditingId(edu.id);
    setEditForm({
      degree: edu.degree,
      institution: edu.institution,
      field_of_study: edu.field_of_study,
      start_date: edu.start_date,
      end_date: edu.end_date,
      grade: edu.grade,
      description: edu.description,
      slug: edu.slug,
      display_order: edu.display_order,
    });
    setError(null);
    setSuccessMessage(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEducation = async (id: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setSaving(id);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/admin/education/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update education");
      }

      const updated = await response.json();

      setEducationList((prev) =>
        prev.map((edu) => (edu.id === id ? { ...edu, ...updated } : edu))
      );

      setSuccessMessage("Education updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update education");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const createEducation = async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!newForm.degree || !newForm.institution || !newForm.slug) {
      setError("Degree, institution, and slug are required");
      return;
    }

    setSaving("new");
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/admin/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create education");
      }

      const result = await response.json();
      await fetchEducation();

      setSuccessMessage("Education created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setCreating(false);
      setNewForm({
        degree: "",
        institution: "",
        field_of_study: "",
        start_date: "",
        end_date: null,
        grade: "",
        description: "",
        slug: "",
        display_order: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create education");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const deleteEducation = async (id: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!confirm("Are you sure you want to delete this education entry? This will also delete all associated modules!")) {
      return;
    }

    setDeleting(id);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/admin/education/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete education");
      }

      setEducationList((prev) => prev.filter((edu) => edu.id !== id));
      setSuccessMessage("Education deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete education");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading education data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Education</h1>
        <p className="text-gray-400">
          Create, update, and manage your education entries
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

      {/* Create New Button */}
      {!creating && (
        <button
          onClick={() => setCreating(true)}
          className="w-full px-4 py-3 bg-green-900/20 hover:bg-green-900/30 text-green-300 rounded-lg transition-colors text-sm font-medium border border-green-900/50"
        >
          + Create New Education Entry
        </button>
      )}

      {/* Create Form */}
      {creating && (
        <div className="bg-[#1a0a0f] rounded-lg border border-green-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Create New Education Entry
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  value={newForm.degree || ""}
                  onChange={(e) =>
                    setNewForm((prev) => ({ ...prev, degree: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="MSc Software Engineering"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Institution *
                </label>
                <input
                  type="text"
                  value={newForm.institution || ""}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      institution: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="Cardiff University"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={newForm.field_of_study || ""}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      field_of_study: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Slug * (URL-friendly)
                </label>
                <input
                  type="text"
                  value={newForm.slug || ""}
                  onChange={(e) =>
                    setNewForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="msc-software-engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newForm.start_date || ""}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      start_date: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  End Date (leave empty if current)
                </label>
                <input
                  type="date"
                  value={newForm.end_date || ""}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      end_date: e.target.value || null,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Grade / GPA
                </label>
                <input
                  type="text"
                  value={newForm.grade || ""}
                  onChange={(e) =>
                    setNewForm((prev) => ({ ...prev, grade: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="First Class Honours"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newForm.description || ""}
                onChange={(e) =>
                  setNewForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                placeholder="Brief description of the degree program..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={createEducation}
                disabled={saving === "new"}
                className="flex-1 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                {saving === "new" ? "Creating..." : "Create Education"}
              </button>
              <button
                onClick={() => setCreating(false)}
                disabled={saving === "new"}
                className="flex-1 px-4 py-2 bg-gray-900/30 hover:bg-gray-900/50 text-gray-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education List */}
      {educationList.length === 0 ? (
        <div className="bg-[#1a0a0f] rounded-lg p-12 border border-gray-800 text-center">
          <div className="text-gray-400">No education entries found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {educationList.map((edu) => {
            const isEditing = editingId === edu.id;
            const isSaving = saving === edu.id;
            const isDeleting = deleting === edu.id;

            return (
              <div
                key={edu.id}
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
                        {edu.degree}
                      </h3>
                      <p className="text-gray-400 text-sm">{edu.institution}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(edu.start_date).getFullYear()} -{" "}
                        {edu.end_date
                          ? new Date(edu.end_date).getFullYear()
                          : "Present"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => startEditing(edu)}
                            className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteEducation(edu.id)}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => saveEducation(edu.id)}
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

                  {!isEditing ? (
                    <div className="space-y-2 text-sm">
                      {edu.grade && (
                        <p className="text-gray-300">
                          <span className="text-gray-500">Grade:</span> {edu.grade}
                        </p>
                      )}
                      {edu.field_of_study && (
                        <p className="text-gray-300">
                          <span className="text-gray-500">Field:</span>{" "}
                          {edu.field_of_study}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-gray-300 mt-2">{edu.description}</p>
                      )}
                      <p className="text-gray-500 text-xs">Slug: {edu.slug}</p>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={editForm.degree || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                degree: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={editForm.institution || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                institution: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={editForm.field_of_study || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                field_of_study: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Grade
                          </label>
                          <input
                            type="text"
                            value={editForm.grade || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                grade: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={editForm.start_date || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                start_date: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={editForm.end_date || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                end_date: e.target.value || null,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={editForm.description || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                        />
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
