"use client";

import { useEffect, useState } from "react";

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
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="work" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-text-secondary">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
            Selected Work
          </p>
          <h2 className="text-5xl font-heading font-semibold">Projects</h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-bg-card border border-border-visible p-6 hover:border-accent-red transition-colors group cursor-pointer"
            >
              {/* Status Badge */}
              <div className="inline-block px-3 py-1 text-xs border border-border-visible text-text-secondary mb-4 uppercase tracking-wide">
                {project.status}
              </div>

              {/* Project Name */}
              <h3 className="text-2xl font-heading font-semibold mb-3 group-hover:text-accent-red transition-colors">
                {project.name}
              </h3>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {project.short_description}
              </p>

              {/* Tech Stack - We'll add this when we connect project_skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs text-text-muted border border-border-subtle px-2 py-1">
                  {project.difficulty_level}
                </span>
              </div>

              {/* Links */}
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
