"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  skills: number;
  projects: number;
  modules: number;
  education: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // Fetch counts from public endpoints
        const [skillsRes, projectsRes, educationRes] = await Promise.all([
          fetch(`${apiUrl}/api/v1/skills`),
          fetch(`${apiUrl}/api/v1/projects`),
          fetch(`${apiUrl}/api/v1/education`),
        ]);

        const [skillsData, projectsData, educationData] = await Promise.all([
          skillsRes.json(),
          projectsRes.json(),
          educationRes.json(),
        ]);

        // Count modules from education data
        let moduleCount = 0;
        if (educationData.data) {
          educationData.data.forEach((degree: any) => {
            if (degree.modules) {
              moduleCount += degree.modules.length;
            }
          });
        }

        setStats({
          skills: skillsData.data?.length || 0,
          projects: projectsData.data?.length || 0,
          modules: moduleCount,
          education: educationData.data?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-[#1a0a0f] rounded-lg p-8 border border-gray-800">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to Admin Panel
        </h1>
        <p className="text-gray-300">Manage your portfolio content from here</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Education Card */}
        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Education</h3>
            <svg
              className="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
          </div>
          {loading ? (
            <div className="text-3xl font-bold text-white animate-pulse">
              ...
            </div>
          ) : (
            <div className="text-3xl font-bold text-white mb-2">
              {stats?.education || 0}
            </div>
          )}
          <p className="text-gray-400 text-sm mb-4">Degrees listed</p>
          <Link
            href="/admin/education"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition"
          >
            Manage Education →
          </Link>
        </div>

        {/* Skills Card */}
        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          {loading ? (
            <div className="text-3xl font-bold text-white animate-pulse">
              ...
            </div>
          ) : (
            <div className="text-3xl font-bold text-white mb-2">
              {stats?.skills}
            </div>
          )}
          <p className="text-gray-400 text-sm mb-4">
            Total skills in portfolio
          </p>
          <Link
            href="/admin/skills"
            className="text-red-400 hover:text-red-300 text-sm font-medium transition"
          >
            Manage Skills →
          </Link>
        </div>

        {/* Projects Card */}
        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Projects</h3>
            <svg
              className="w-8 h-8 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          {loading ? (
            <div className="text-3xl font-bold text-white animate-pulse">
              ...
            </div>
          ) : (
            <div className="text-3xl font-bold text-white mb-2">
              {stats?.projects}
            </div>
          )}
          <p className="text-gray-400 text-sm mb-4">Total projects showcased</p>
          <Link
            href="/admin/projects"
            className="text-red-300 hover:text-red-200 text-sm font-medium transition"
          >
            Manage Projects →
          </Link>
        </div>

        {/* Modules Card */}
        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Modules</h3>
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          {loading ? (
            <div className="text-3xl font-bold text-white animate-pulse">
              ...
            </div>
          ) : (
            <div className="text-3xl font-bold text-white mb-2">
              {stats?.modules}
            </div>
          )}
          <p className="text-gray-400 text-sm mb-4">
            University modules listed
          </p>
          <Link
            href="/admin/modules"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
          >
            Manage Modules →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1a0a0f] rounded-lg p-8 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/education"
            className="flex items-center space-x-3 p-4 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-800 hover:border-gray-700 transition group"
          >
            <svg
              className="w-6 h-6 text-purple-400 group-hover:text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
            <span className="text-white font-medium">Manage Education</span>
          </Link>

          <Link
            href="/admin/modules"
            className="flex items-center space-x-3 p-4 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-800 hover:border-gray-700 transition group"
          >
            <svg
              className="w-6 h-6 text-blue-400 group-hover:text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-white font-medium">Edit Module Details</span>
          </Link>

          <Link
            href="/admin/skills"
            className="flex items-center space-x-3 p-4 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-800 hover:border-gray-700 transition group"
          >
            <svg
              className="w-6 h-6 text-red-400 group-hover:text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-white font-medium">Update Skill Levels</span>
          </Link>

          <Link
            href="/admin/projects"
            className="flex items-center space-x-3 p-4 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-800 hover:border-gray-700 transition group"
          >
            <svg
              className="w-6 h-6 text-red-300 group-hover:text-red-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-white font-medium">Manage Projects</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-3 p-4 bg-black/30 hover:bg-black/50 rounded-lg border border-gray-800 hover:border-gray-700 transition group"
          >
            <svg
              className="w-6 h-6 text-green-400 group-hover:text-green-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-white font-medium">Preview Portfolio</span>
          </Link>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/20 backdrop-blur-lg rounded-xl p-6 border border-blue-800">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5"
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
            <h3 className="text-white font-semibold mb-1">
              Changes are Persistent
            </h3>
            <p className="text-gray-300 text-sm">
              All edits you make through this admin panel are stored in the
              PostgreSQL database and will persist across restarts. No need to
              re-seed data!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
