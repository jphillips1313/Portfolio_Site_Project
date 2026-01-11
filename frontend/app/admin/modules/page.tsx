"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Module {
  id: string;
  module_code: string;
  module_name: string;
  credits: number | null;
  grade: string | null;
  year: number;
  semester: number | null;
  module_type: string | null;
  description: string | null;
  detailed_content: string | null;
}

interface Degree {
  id: string;
  degree_title: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  gpa: number | null;
  modules: Module[];
}

export default function ModulesEditor() {
  const { token } = useAuth();
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Module>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchModules();
    }
  }, [token]);

  const fetchModules = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/education`);
      const data = await response.json();

      setDegrees(data.data || []);
    } catch (err) {
      setError("Failed to load modules");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (module: Module) => {
    setEditingModule(module.id);
    setEditForm({
      credits: module.credits,
      grade: module.grade,
      description: module.description,
      detailed_content: module.detailed_content,
    });
    setError(null);
    setSuccessMessage(null);
  };

  const cancelEditing = () => {
    setEditingModule(null);
    setEditForm({});
  };

  const saveModule = async (moduleId: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setSaving(moduleId);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const payload = {
        credits: editForm.credits
          ? parseFloat(editForm.credits.toString())
          : null,
        grade: editForm.grade || null,
        description: editForm.description || null,
        detailed_content: editForm.detailed_content || null,
      };

      const response = await fetch(
        `${apiUrl}/api/v1/admin/modules/${moduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update module");
      }

      const updatedModule = await response.json();

      // Update local state
      setDegrees((prev) =>
        prev.map((degree) => ({
          ...degree,
          modules: degree.modules.map((mod) =>
            mod.id === moduleId ? { ...mod, ...updatedModule.data } : mod
          ),
        }))
      );

      setSuccessMessage("Module updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setEditingModule(null);
      setEditForm({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update module");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  if (!token || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading modules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Modules</h1>
        <p className="text-gray-400">
          Update module grades, credits, and detailed content
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

      {degrees.map((degree) => (
        <div
          key={degree.id}
          className="bg-[#1a0a0f] rounded-lg border border-gray-800 overflow-hidden"
        >
          {/* Degree Header */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-b border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {degree.degree_title}
                </h2>
                <p className="text-gray-300">{degree.institution}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span>
                    {degree.start_date} - {degree.end_date || "Present"}
                  </span>
                  {degree.gpa && <span>GPA: {degree.gpa}</span>}
                </div>
              </div>
              <div className="bg-blue-900/40 px-4 py-2 rounded-lg">
                <div className="text-2xl font-bold text-blue-300">
                  {degree.modules.length}
                </div>
                <div className="text-xs text-gray-400">Modules</div>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="p-6">
            <div className="space-y-4">
              {degree.modules.map((module) => {
                const isEditing = editingModule === module.id;
                const isSaving = saving === module.id;

                return (
                  <div
                    key={module.id}
                    className={`bg-black/30 rounded-lg border transition-all ${
                      isEditing
                        ? "border-blue-700 shadow-lg shadow-blue-900/20"
                        : "border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="p-5">
                      {/* Module Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {module.module_code}: {module.module_name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Year {module.year}</span>
                            {module.semester && (
                              <span>Semester {module.semester}</span>
                            )}
                            {module.module_type && (
                              <span className="px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded text-xs">
                                {module.module_type}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          {!isEditing ? (
                            <button
                              onClick={() => startEditing(module)}
                              className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                            >
                              Edit
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => saveModule(module.id)}
                                disabled={isSaving}
                                className="px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                              >
                                {isSaving ? "Saving..." : "Save"}
                              </button>
                              <button
                                onClick={cancelEditing}
                                disabled={isSaving}
                                className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Module Details */}
                      {!isEditing ? (
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-gray-400">Credits:</span>
                              <span className="ml-2 text-white font-medium">
                                {module.credits || "Not set"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Grade:</span>
                              <span className="ml-2 text-white font-medium">
                                {module.grade || "Not set"}
                              </span>
                            </div>
                          </div>

                          {module.description && (
                            <div>
                              <div className="text-gray-400 mb-1">
                                Description:
                              </div>
                              <div className="text-gray-300">
                                {module.description}
                              </div>
                            </div>
                          )}

                          {module.detailed_content && (
                            <div>
                              <div className="text-gray-400 mb-1">
                                Detailed Content:
                              </div>
                              <div className="text-gray-300 whitespace-pre-wrap">
                                {module.detailed_content}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-300 mb-2">
                                Credits
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={editForm.credits || ""}
                                onChange={(e) =>
                                  setEditForm((prev) => ({
                                    ...prev,
                                    credits: parseFloat(e.target.value) || null,
                                  }))
                                }
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                placeholder="e.g., 20"
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
                                placeholder="e.g., A, 85%, First"
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
                              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                              placeholder="Brief description of the module..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-300 mb-2">
                              Detailed Content
                            </label>
                            <textarea
                              value={editForm.detailed_content || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  detailed_content: e.target.value,
                                }))
                              }
                              rows={6}
                              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                              placeholder="Detailed topics covered, projects, learning outcomes..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {degrees.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No education data found
        </div>
      )}

      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg
            className="w-5 h-5 text-blue-400 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-blue-400 font-semibold mb-1">Edit Mode</h3>
            <p className="text-gray-400 text-sm">
              Click "Edit" to modify module details. Changes are saved to the
              database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
