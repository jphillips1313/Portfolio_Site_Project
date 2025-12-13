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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/skills`)
      .then((res) => res.json())
      .then((data) => {
        setSkills(data.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch skills:", err);
        setError("Failed to load skills. Please try again.");
        setLoading(false);
      });
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/skills`)
      .then((res) => res.json())
      .then((data) => {
        setSkills(data.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch skills:", err);
        setError("Failed to load skills. Please try again.");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <section id="skills" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header Skeleton */}
          <div className="mb-12">
            <div className="h-3 w-32 bg-bg-secondary/50 rounded mb-2 animate-pulse" />
            <div className="h-12 w-48 bg-bg-secondary/50 rounded animate-pulse" />
          </div>

          {/* Skills Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-bg-card border border-border-visible p-6"
              >
                {/* Category Header Skeleton */}
                <div className="h-6 w-24 bg-bg-secondary/50 rounded mb-6 animate-pulse" />

                {/* Skills List Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-4 w-20 bg-bg-secondary/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-bg-secondary/50 rounded animate-pulse" />
                      </div>
                      {/* Progress Bar Skeleton */}
                      <div className="w-full h-0.5 bg-border-visible overflow-hidden">
                        <div className="h-full bg-bg-secondary/50 w-3/4 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
              Technical Expertise
            </p>
            <h2 className="text-5xl font-heading font-semibold">Skills</h2>
          </div>
          <div className="bg-bg-card border border-border-visible p-8 text-center">
            <p className="text-text-secondary mb-4">{error}</p>
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-accent-red text-white hover:bg-accent-red-hover transition-colors"
            >
              Retry
            </button>
          </div>
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

  // Define category order
  const categoryOrder = ["Backend", "Frontend", "Languages", "Tools"];
  const sortedCategories = Object.entries(skillsByCategory).sort(([a], [b]) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    // If category not in order list, put it at the end
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

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
          {sortedCategories.map(([category, categorySkills]) => (
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
                      <div className="w-full h-1 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${skill.proficiency_level}%`,
                            backgroundColor: "#f5e8ed",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
