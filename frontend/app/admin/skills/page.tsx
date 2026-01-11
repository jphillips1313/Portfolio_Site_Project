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
                  {saving === skill.id && (
                    <span className="text-sm text-gray-400">Saving...</span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      Proficiency Level
                    </label>
                    <span className="text-sm font-semibold text-white bg-gray-800 px-3 py-1 rounded">
                      {skill.proficiency_level}%
                    </span>
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
