"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number;
  years_experience: number;
  icon?: string;
}

interface SkillsByCategory {
  [category: string]: Skill[];
}

export default function SkillsEditor() {
  const { token } = useAuth();
  const [skills, setSkills] = useState<SkillsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newSkillForm, setNewSkillForm] = useState({
    name: "",
    category: "",
    proficiency_level: 50,
    years_experience: 0,
    icon: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  console.log("SkillsEditor - token:", token ? "exists" : "missing");

  useEffect(() => {
    if (token) {
      fetchSkills();
    }
  }, [token]);

  const fetchSkills = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/skills`);
      const data = await response.json();

      const grouped: SkillsByCategory = {};
      if (data.data) {
        data.data.forEach((skill: Skill) => {
          if (!grouped[skill.category]) {
            grouped[skill.category] = [];
          }
          grouped[skill.category].push(skill);
        });
      }

      setSkills(grouped);
    } catch (err) {
      setError("Failed to load skills");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSkill = async (skillId: string, updates: Partial<Skill>) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setSaving(skillId);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      console.log("Updating skill with token:", token.substring(0, 20) + "...");

      const response = await fetch(`${apiUrl}/api/v1/admin/skills/${skillId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update skill");
      }

      setSkills((prev) => {
        const newSkills = { ...prev };
        Object.keys(newSkills).forEach((category) => {
          newSkills[category] = newSkills[category].map((skill) =>
            skill.id === skillId ? { ...skill, ...updates } : skill
          );
        });
        return newSkills;
      });

      setSuccessMessage("Skill updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update skill");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const createSkill = async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!newSkillForm.name || !newSkillForm.category) {
      setError("Name and category are required");
      return;
    }

    setSaving("new");
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/v1/admin/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSkillForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create skill");
      }

      // Refresh skills list
      await fetchSkills();

      setSuccessMessage("Skill created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset form
      setCreating(false);
      setNewSkillForm({
        name: "",
        category: "",
        proficiency_level: 50,
        years_experience: 0,
        icon: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create skill");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  const deleteSkill = async (skillId: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    setSaving(skillId);
    setError(null);
    setSuccessMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/v1/admin/skills/${skillId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete skill");
      }

      // Remove from local state
      setSkills((prev) => {
        const newSkills = { ...prev };
        Object.keys(newSkills).forEach((category) => {
          newSkills[category] = newSkills[category].filter(
            (skill) => skill.id !== skillId
          );
        });
        return newSkills;
      });

      setSuccessMessage("Skill deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  if (!token || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Skills</h1>
        <p className="text-gray-400">
          Update proficiency levels and experience for your skills
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

      {/* Create New Skill Button */}
      {!creating && (
        <button
          onClick={() => setCreating(true)}
          className="w-full px-4 py-3 bg-green-900/20 hover:bg-green-900/30 text-green-300 rounded-lg transition-colors text-sm font-medium border border-green-900/50"
        >
          + Create New Skill
        </button>
      )}

      {/* Create New Skill Form */}
      {creating && (
        <div className="bg-[#1a0a0f] rounded-lg border border-green-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Create New Skill
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={newSkillForm.name}
                  onChange={(e) =>
                    setNewSkillForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                  placeholder="e.g., React, Python, Docker"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={newSkillForm.category}
                  onChange={(e) =>
                    setNewSkillForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools">Tools</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Proficiency Level (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newSkillForm.proficiency_level}
                  onChange={(e) =>
                    setNewSkillForm((prev) => ({
                      ...prev,
                      proficiency_level: Math.min(
                        100,
                        Math.max(0, parseInt(e.target.value) || 0)
                      ),
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={newSkillForm.years_experience}
                  onChange={(e) =>
                    setNewSkillForm((prev) => ({
                      ...prev,
                      years_experience: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Icon (optional)
              </label>
              <input
                type="text"
                value={newSkillForm.icon}
                onChange={(e) =>
                  setNewSkillForm((prev) => ({
                    ...prev,
                    icon: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 focus:border-transparent"
                placeholder="e.g., code, database, zap"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={createSkill}
                disabled={saving === "new"}
                className="flex-1 px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                {saving === "new" ? "Creating..." : "Create Skill"}
              </button>
              <button
                onClick={() => {
                  setCreating(false);
                  setNewSkillForm({
                    name: "",
                    category: "",
                    proficiency_level: 50,
                    years_experience: 0,
                    icon: "",
                  });
                }}
                disabled={saving === "new"}
                className="flex-1 px-4 py-2 bg-gray-900/30 hover:bg-gray-900/50 text-gray-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {Object.entries(skills).map(([category, categorySkills]) => (
        <div
          key={category}
          className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800"
        >
          <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-gray-800">
            {category}
          </h2>

          <div className="space-y-6">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 bg-black/30 rounded-lg border border-gray-800 hover:border-gray-700 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">
                    {skill.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {saving === skill.id && (
                      <span className="text-sm text-gray-400">Saving...</span>
                    )}
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      disabled={saving === skill.id}
                      className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded text-sm transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      Proficiency Level
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.proficiency_level}
                        onChange={(e) => {
                          const value = Math.min(
                            100,
                            Math.max(0, parseInt(e.target.value) || 0)
                          );
                          updateSkill(skill.id, {
                            proficiency_level: value,
                          });
                        }}
                        disabled={saving === skill.id}
                        className="w-16 px-2 py-1 text-sm text-center bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-900 disabled:opacity-50"
                      />
                      <span className="text-sm text-gray-400">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.proficiency_level}
                    onChange={(e) =>
                      updateSkill(skill.id, {
                        proficiency_level: parseInt(e.target.value),
                      })
                    }
                    disabled={saving === skill.id}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-900 disabled:opacity-50"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Expert</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={skill.years_experience}
                    onChange={(e) =>
                      updateSkill(skill.id, {
                        years_experience: parseFloat(e.target.value),
                      })
                    }
                    disabled={saving === skill.id}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent disabled:opacity-50"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

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
            <h3 className="text-blue-400 font-semibold mb-1">
              Auto-save enabled
            </h3>
            <p className="text-gray-400 text-sm">
              Changes are saved automatically as you adjust the sliders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
