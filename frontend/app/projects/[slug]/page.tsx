"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

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
  demo_video_url: string | null;
  display_order: number;
  view_count: number;
}

interface ProjectWithSkills {
  project: Project;
  skills: Skill[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [data, setData] = useState<ProjectWithSkills | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/v1/projects/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Project not found");
          } else {
            setError("Failed to load project");
          }
          return;
        }

        const result = await response.json();
        if (result.success && result.data) {
          setData({
            project: result.data.project,
            skills: result.data.skills || [],
          });
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {error === "Project not found" ? "404" : "Error"}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {error || "Project not found"}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              ← Go Back
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { project, skills } = data;

  // Difficulty level styling
  const difficultyColors: Record<string, string> = {
    beginner: "text-green-400 bg-green-900/30",
    intermediate: "text-yellow-400 bg-yellow-900/30",
    advanced: "text-red-400 bg-red-900/30",
  };

  const difficultyColor = project.difficulty_level
    ? difficultyColors[project.difficulty_level.toLowerCase()] ||
      "text-gray-400 bg-gray-800"
    : "text-gray-400 bg-gray-800";

  // Status styling
  const statusColor =
    project.status === "active"
      ? "text-green-400 bg-green-900/30"
      : "text-yellow-400 bg-yellow-900/30";

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a]">
      {/* Header Section */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
          >
            <span>←</span> Back
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {project.name}
            </h1>
            <span className={`px-3 py-1 rounded-lg text-sm ${statusColor}`}>
              {project.status}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-lg text-sm bg-red-900/30 text-red-400">
                Featured
              </span>
            )}
          </div>

          {project.short_description && (
            <p className="text-xl text-gray-300 mb-6">
              {project.short_description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            {project.difficulty_level && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Difficulty:</span>
                <span
                  className={`px-2 py-1 rounded ${difficultyColor} capitalize`}
                >
                  {project.difficulty_level}
                </span>
              </div>
            )}
            {(project.start_date || project.end_date) && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Timeline:</span>
                <span className="text-gray-300">
                  {formatDate(project.start_date) || "Unknown"} -{" "}
                  {project.end_date ? formatDate(project.end_date) : "Present"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Views:</span>
              <span className="text-gray-300">{project.view_count}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Full Description */}
            {project.full_description && (
              <section className="bg-[#1a0a0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  About This Project
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {project.full_description}
                </p>
              </section>
            )}

            {/* Demo Video */}
            {project.demo_video_url && (
              <section className="bg-[#1a0a0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Demo Video
                </h2>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Video player placeholder</p>
                  {/* You can integrate a video player here */}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            {skills.length > 0 && (
              <section className="bg-[#1a0a0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Tech Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Links */}
            <section className="bg-[#1a0a0f] border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Links</h2>
              <div className="space-y-3">
                {project.github_url && project.github_url !== "N/A" && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <span className="text-gray-300">View on GitHub</span>
                    <span className="text-gray-500 group-hover:text-red-400 transition-colors">
                      →
                    </span>
                  </a>
                )}
                {project.live_url && project.live_url !== "N/A" && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <span className="text-gray-300">Live Demo</span>
                    <span className="text-gray-500 group-hover:text-red-400 transition-colors">
                      →
                    </span>
                  </a>
                )}
                {(!project.github_url || project.github_url === "N/A") &&
                  (!project.live_url || project.live_url === "N/A") && (
                    <p className="text-gray-500 text-sm">
                      No external links available
                    </p>
                  )}
              </div>
            </section>

            {/* Project Image */}
            {project.image_url && (
              <section className="bg-[#1a0a0f] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
                <img
                  src={project.image_url}
                  alt={project.name}
                  className="w-full rounded-lg"
                />
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
