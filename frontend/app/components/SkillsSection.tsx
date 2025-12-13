"use client";

import { useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number | null;
  years_experience: number | null;
  status: string;
}

interface SkillsByCategory {
  [category: string]: Skill[];
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch skills:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-text-secondary">Loading skills...</p>
        </div>
      </section>
    );
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as SkillsByCategory);

  return (
    <section id="skills" className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
            Technical Expertise
          </p>
          <h2 className="text-5xl font-heading font-semibold">Skills</h2>
        </div>

        {/* Skills Grid by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(skillsByCategory).map(
            ([category, categorySkills]) => (
              <div
                key={category}
                className="bg-bg-card border border-border-visible p-6"
              >
                {/* Category Header */}
                <h3 className="text-xl font-heading font-semibold mb-6 text-text-primary">
                  {category}
                </h3>

                {/* Skills List */}
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-secondary text-sm">
                          {skill.name}
                        </span>
                        {skill.proficiency_level && (
                          <span className="text-text-muted text-xs">
                            {skill.proficiency_level}%
                          </span>
                        )}
                      </div>
                      {/* Progress Bar */}
                      {skill.proficiency_level && (
                        <div className="w-full h-0.5 bg-border-visible overflow-hidden">
                          <div
                            className="h-full bg-accent-red transition-all duration-300"
                            style={{ width: `${skill.proficiency_level}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
