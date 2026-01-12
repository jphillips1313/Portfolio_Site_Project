"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  grade: string;
  description: string;
  slug: string;
  modules?: Module[];
}

interface Module {
  id: string;
  name: string;
  code: string | null;
  credits: number | null;
  grade: string | null;
  semester: string | null;
  description: string | null;
  detailed_content: any;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number | null;
}

interface Project {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  status: string;
  github_url: string | null;
  live_url: string | null;
  skills: Skill[] | null;
}

export default function CVPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedDegree, setExpandedDegree] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // Fetch all data
    Promise.all([
      fetch(`${apiUrl}/api/v1/education`).then((r) => r.json()),
      fetch(`${apiUrl}/api/v1/skills`).then((r) => r.json()),
      fetch(`${apiUrl}/api/v1/projects`).then((r) => r.json()),
    ])
      .then(([eduData, skillsData, projectsData]) => {
        setEducation(Array.isArray(eduData?.data) ? eduData.data : []);
        setSkills(Array.isArray(skillsData?.data) ? skillsData.data : []);

        // Transform projects data with proper null checks
        const transformedProjects = Array.isArray(projectsData?.data)
          ? projectsData.data.map((item: any) => ({
              ...(item?.project || {}),
              skills: Array.isArray(item?.skills) ? item.skills : [],
            }))
          : [];
        setProjects(transformedProjects);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch CV data:", err);
        setLoading(false);
      });
  }, [apiUrl]);

  const handleDegreeToggle = (id: string) => {
    if (expandedDegree === id) {
      setExpandedDegree(null);
    } else {
      setExpandedDegree(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-text-secondary">Loading CV...</p>
        </div>
      </div>
    );
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryOrder = ["Backend", "Frontend", "Languages", "Tools"];
  const sortedCategories = Object.entries(skillsByCategory).sort(([a], [b]) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-visible py-6 print:border-black">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-text-secondary hover:text-accent-red transition-colors text-sm"
          >
            ← Back to Portfolio
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-border-visible text-text-primary hover:border-accent-red transition-colors text-sm print:hidden"
          >
            Print / Save as PDF
          </button>
        </div>
      </header>

      {/* CV Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Personal Info */}
        <section className="mb-12">
          <h1 className="text-5xl font-heading font-bold mb-2">
            Jack Phillips
          </h1>
          <p className="text-xl text-text-secondary mb-4">Software Engineer</p>
          <div className="text-text-muted text-sm space-y-1">
            <p>Cardiff, Wales</p>
            <p>jackphillips1313@gmail.com</p>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-4 text-text-primary border-b border-border-visible pb-2">
            Summary
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Physics graduate turned software engineer with expertise in
            full-stack development. Proficient in Go, PostgreSQL, React, and
            modern web technologies. Currently completing MSc Software
            Engineering at Cardiff University while building production-ready
            applications.
          </p>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-text-primary border-b border-border-visible pb-2">
            Education
          </h2>

          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="border border-border-visible rounded"
              >
                {/* Degree Header - Clickable */}
                <div
                  onClick={() => handleDegreeToggle(edu.id)}
                  className="p-6 cursor-pointer hover:bg-bg-secondary/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">
                        {edu.degree}
                      </h3>
                      <p className="text-text-secondary">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      {edu.grade && (
                        <span className="inline-block px-3 py-1 bg-accent-red/10 text-accent-red rounded text-sm font-medium mb-1">
                          {edu.grade}
                        </span>
                      )}
                      <p className="text-text-muted text-sm">
                        {new Date(edu.start_date).getFullYear()} -{" "}
                        {edu.end_date
                          ? new Date(edu.end_date).getFullYear()
                          : "Present"}
                      </p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mt-2">
                    {edu.description}
                  </p>

                  <p className="text-accent-red text-sm mt-3">
                    {expandedDegree === edu.id
                      ? "− Hide modules"
                      : "+ View all modules"}
                  </p>
                </div>

                {/* Modules - Expanded */}
                {expandedDegree === edu.id && (
                  <div className="px-6 pb-6 border-t border-border-visible">
                    <h4 className="font-semibold text-text-primary mt-4 mb-3">
                      Modules:
                    </h4>
                    {edu.modules && edu.modules.length > 0 ? (
                      <div className="space-y-3">
                        {edu.modules.map((module) => (
                          <div
                            key={module.id}
                            className="bg-bg-secondary/30 border border-border-subtle rounded p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium text-text-primary">
                                  {module.name}
                                </h5>
                                {module.code && (
                                  <p className="text-text-muted text-xs">
                                    {module.code}
                                  </p>
                                )}
                              </div>
                              <div className="text-right text-sm">
                                {module.grade && (
                                  <p className="text-text-secondary">
                                    Grade: {module.grade}
                                  </p>
                                )}
                                {module.credits && (
                                  <p className="text-text-muted">
                                    {module.credits} credits
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            {module.description && (
                              <p className="text-text-secondary text-sm mt-2">
                                {module.description}
                              </p>
                            )}

                            {/* Detailed content */}
                            {module.detailed_content &&
                              typeof module.detailed_content === "object" &&
                              Object.keys(module.detailed_content).length >
                                0 && (
                                <div className="mt-3 pt-3 border-t border-border-subtle">
                                  <div className="text-text-secondary text-sm space-y-2">
                                    {module.detailed_content.assessment && (
                                      <p>
                                        <span className="font-medium">
                                          Assessment:
                                        </span>{" "}
                                        {module.detailed_content.assessment}
                                      </p>
                                    )}
                                    {module.detailed_content.topics && (
                                      <div>
                                        <span className="font-medium">
                                          Topics:
                                        </span>
                                        <span className="ml-2">
                                          {Array.isArray(
                                            module.detailed_content.topics
                                          )
                                            ? module.detailed_content.topics.join(
                                                ", "
                                              )
                                            : module.detailed_content.topics}
                                        </span>
                                      </div>
                                    )}
                                    {module.detailed_content.projects && (
                                      <div>
                                        <span className="font-medium">
                                          Projects:
                                        </span>
                                        <span className="ml-2">
                                          {Array.isArray(
                                            module.detailed_content.projects
                                          )
                                            ? module.detailed_content.projects.join(
                                                ", "
                                              )
                                            : module.detailed_content.projects}
                                        </span>
                                      </div>
                                    )}
                                    {module.detailed_content.content && (
                                      <p>{module.detailed_content.content}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                            {module.semester && (
                              <div className="mt-2 text-xs text-text-muted">
                                Semester {module.semester}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-muted text-sm">
                        No modules available
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-text-primary border-b border-border-visible pb-2">
            Technical Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedCategories.map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="font-semibold text-text-primary mb-3">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-bg-card border border-border-subtle text-text-secondary text-sm rounded"
                    >
                      {skill.name}
                      {skill.proficiency_level && (
                        <span className="text-text-muted ml-1">
                          ({skill.proficiency_level}%)
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-text-primary border-b border-border-visible pb-2">
            Projects
          </h2>

          <div className="space-y-6">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-border-visible rounded p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {project.name}
                    </h3>
                    <span className="px-2 py-1 border border-border-visible text-text-muted text-xs uppercase">
                      {project.status}
                    </span>
                  </div>

                  <p className="text-text-secondary mb-4 leading-relaxed">
                    {project.full_description || project.short_description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <p className="text-text-muted text-xs uppercase mb-2">
                      Technologies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(project.skills || []).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 bg-bg-secondary border border-border-subtle text-text-secondary text-xs"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  {(project.github_url || project.live_url) && (
                    <div className="flex gap-4 text-sm">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-red hover:underline"
                        >
                          GitHub →
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-red hover:underline"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-text-muted">No projects available</p>
            )}
          </div>
        </section>

        {/* Achievements (placeholder for later) */}
        <section className="mb-12">
          <h2 className="text-2xl font-heading font-semibold mb-6 text-text-primary border-b border-border-visible pb-2">
            Achievements & Activities
          </h2>
          <ul className="space-y-2 text-text-secondary">
            <li>
              • Physics Society President, University of Salford (2022-2023)
            </li>
            <li>
              • Contributor to published academic paper on high-pressure fluid
              physics
            </li>
            <li>• Selected for Wales Basketball U18's (2016)</li>
            <li>• Captain, Baglan Blazers Basketball (2014-2017)</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
