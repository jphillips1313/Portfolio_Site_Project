"use client";

import { useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  status: string;
  start_date: string;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  difficulty_level: string;
  skills: Skill[];
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/projects`)
      .then((res) => res.json())
      .then((response) => {
        // Transform the data to flatten project and skills
        const transformedProjects = response.data.map((item: any) => ({
          ...item.project,
          skills: item.skills,
        }));
        setProjects(transformedProjects);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again.");
        setLoading(false);
      });
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/api/v1/projects`)
      .then((res) => res.json())
      .then((response) => {
        const transformedProjects = response.data.map((item: any) => ({
          ...item.project,
          skills: item.skills,
        }));
        setProjects(transformedProjects);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again.");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <section id="work" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
              Selected Work
            </p>
            <h2 className="text-5xl font-heading font-semibold">Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-bg-card border border-border-visible p-6"
              >
                <div className="h-6 w-20 bg-bg-secondary/50 rounded mb-4 animate-pulse" />
                <div className="h-8 w-3/4 bg-bg-secondary/50 rounded mb-3 animate-pulse" />
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-bg-secondary/50 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-bg-secondary/50 rounded animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="h-6 w-16 bg-bg-secondary/50 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-bg-secondary/50 rounded animate-pulse" />
                  <div className="h-6 w-14 bg-bg-secondary/50 rounded animate-pulse" />
                </div>
                <div className="flex gap-4">
                  <div className="h-4 w-20 bg-bg-secondary/50 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-bg-secondary/50 rounded animate-pulse" />
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
      <section id="work" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
              Selected Work
            </p>
            <h2 className="text-5xl font-heading font-semibold">Projects</h2>
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

  return (
    <section id="work" className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
            Selected Work
          </p>
          <h2 className="text-5xl font-heading font-semibold">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-bg-card border border-border-visible p-6 hover:border-accent-red transition-colors group cursor-pointer"
            >
              <div className="inline-block px-3 py-1 text-xs border border-border-visible text-text-secondary mb-4 uppercase tracking-wide">
                {project.status}
              </div>

              <h3 className="text-2xl font-heading font-semibold mb-3 group-hover:text-accent-red transition-colors">
                {project.name}
              </h3>

              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {project.short_description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.skills &&
                  project.skills.map((skill, index) => (
                    <span
                      key={skill?.id || `skill-${project.id}-${index}`}
                      className="text-xs text-text-muted border border-border-subtle px-2 py-1"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>

              <div className="flex gap-4 text-sm">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent-red transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub →
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent-red transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Demo →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
