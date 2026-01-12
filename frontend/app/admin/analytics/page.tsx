"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  projects: {
    total: number;
    totalViews: number;
    mostViewed: { name: string; slug: string; views: number }[];
  };
  blog: {
    total: number;
    totalViews: number;
    published: number;
    drafts: number;
    mostViewed: { title: string; slug: string; views: number }[];
  };
  skills: {
    total: number;
  };
  education: {
    total: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // Fetch all data
        const [projectsRes, blogRes, skillsRes, educationRes] =
          await Promise.all([
            fetch(`${apiUrl}/api/v1/projects`),
            fetch(`${apiUrl}/api/v1/blog`),
            fetch(`${apiUrl}/api/v1/skills`),
            fetch(`${apiUrl}/api/v1/education`),
          ]);

        const [projectsData, blogData, skillsData, educationData] =
          await Promise.all([
            projectsRes.json(),
            blogRes.json(),
            skillsRes.json(),
            educationRes.json(),
          ]);

        // Process projects data
        const projects = projectsData.data || [];
        const projectsList = projects.map((item: any) => ({
          name: item.project?.name || item.name,
          slug: item.project?.slug || item.slug,
          views: item.project?.view_count || item.view_count || 0,
        }));

        const totalProjectViews = projectsList.reduce(
          (sum: number, p: any) => sum + p.views,
          0
        );
        const mostViewedProjects = projectsList
          .sort((a: any, b: any) => b.views - a.views)
          .slice(0, 5);

        // Process blog data
        const blogPosts = blogData.data || [];
        const publishedPosts = blogPosts.filter(
          (post: any) => post.status === "published"
        );
        const draftPosts = blogPosts.filter(
          (post: any) => post.status === "draft"
        );

        const totalBlogViews = blogPosts.reduce(
          (sum: number, post: any) => sum + (post.view_count || 0),
          0
        );

        const mostViewedPosts = blogPosts
          .map((post: any) => ({
            title: post.title,
            slug: post.slug,
            views: post.view_count || 0,
          }))
          .sort((a: any, b: any) => b.views - a.views)
          .slice(0, 5);

        setAnalytics({
          projects: {
            total: projects.length,
            totalViews: totalProjectViews,
            mostViewed: mostViewedProjects,
          },
          blog: {
            total: blogPosts.length,
            totalViews: totalBlogViews,
            published: publishedPosts.length,
            drafts: draftPosts.length,
            mostViewed: mostViewedPosts,
          },
          skills: {
            total: skillsData.data?.length || 0,
          },
          education: {
            total: educationData.data?.length || 0,
          },
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-800 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const totalViews = analytics.projects.totalViews + analytics.blog.totalViews;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">
          Track your portfolio's performance and engagement
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Total Views</div>
          <div className="text-3xl font-bold text-white">{totalViews}</div>
          <div className="text-xs text-gray-500 mt-1">
            Projects + Blog combined
          </div>
        </div>

        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Project Views</div>
          <div className="text-3xl font-bold text-red-400">
            {analytics.projects.totalViews}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.projects.total} projects
          </div>
        </div>

        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Blog Views</div>
          <div className="text-3xl font-bold text-yellow-400">
            {analytics.blog.totalViews}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {analytics.blog.published} published posts
          </div>
        </div>

        <div className="bg-[#1a0a0f] rounded-lg p-6 border border-gray-800">
          <div className="text-sm text-gray-400 mb-2">Content Items</div>
          <div className="text-3xl font-bold text-green-400">
            {analytics.projects.total +
              analytics.blog.total +
              analytics.skills.total}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total content</div>
        </div>
      </div>

      {/* Content Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Analytics */}
        <div className="bg-[#1a0a0f] rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Projects Performance
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Projects:</span>
              <span className="text-white font-medium">
                {analytics.projects.total}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Views:</span>
              <span className="text-white font-medium">
                {analytics.projects.totalViews}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Avg Views per Project:</span>
              <span className="text-white font-medium">
                {analytics.projects.total > 0
                  ? Math.round(
                      analytics.projects.totalViews / analytics.projects.total
                    )
                  : 0}
              </span>
            </div>
          </div>

          {/* Most Viewed Projects */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Most Viewed Projects
            </h3>
            <div className="space-y-2">
              {analytics.projects.mostViewed.map((project, index) => (
                <div
                  key={project.slug}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-mono">
                      #{index + 1}
                    </span>
                    <span className="text-gray-300">{project.name}</span>
                  </div>
                  <span className="text-red-400 font-medium">
                    {project.views}
                  </span>
                </div>
              ))}
              {analytics.projects.mostViewed.length === 0 && (
                <p className="text-gray-500 text-sm">No project views yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Blog Analytics */}
        <div className="bg-[#1a0a0f] rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Blog Performance
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Posts:</span>
              <span className="text-white font-medium">
                {analytics.blog.total}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Published:</span>
              <span className="text-green-400 font-medium">
                {analytics.blog.published}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Drafts:</span>
              <span className="text-yellow-400 font-medium">
                {analytics.blog.drafts}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Views:</span>
              <span className="text-white font-medium">
                {analytics.blog.totalViews}
              </span>
            </div>
          </div>

          {/* Most Viewed Posts */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Most Viewed Posts
            </h3>
            <div className="space-y-2">
              {analytics.blog.mostViewed.map((post, index) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-mono">
                      #{index + 1}
                    </span>
                    <span className="text-gray-300 truncate max-w-xs">
                      {post.title}
                    </span>
                  </div>
                  <span className="text-yellow-400 font-medium">
                    {post.views}
                  </span>
                </div>
              ))}
              {analytics.blog.mostViewed.length === 0 && (
                <p className="text-gray-500 text-sm">No blog views yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Summary */}
      <div className="bg-[#1a0a0f] rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Content Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {analytics.education.total}
            </div>
            <div className="text-sm text-gray-400">Degrees</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {analytics.projects.total}
            </div>
            <div className="text-sm text-gray-400">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {analytics.skills.total}
            </div>
            <div className="text-sm text-gray-400">Skills</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {analytics.blog.total}
            </div>
            <div className="text-sm text-gray-400">Blog Posts</div>
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-[#1a0a0f] rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">
              Most Popular Content Type
            </div>
            <div className="text-lg font-semibold text-white">
              {analytics.projects.totalViews > analytics.blog.totalViews
                ? "Projects"
                : "Blog Posts"}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">
              Average Project Views
            </div>
            <div className="text-lg font-semibold text-white">
              {analytics.projects.total > 0
                ? Math.round(
                    analytics.projects.totalViews / analytics.projects.total
                  )
                : 0}
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Average Blog Views</div>
            <div className="text-lg font-semibold text-white">
              {analytics.blog.total > 0
                ? Math.round(analytics.blog.totalViews / analytics.blog.total)
                : 0}
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>Note:</strong> Analytics are based on view counts tracked
          in the database. View tracking is already implemented for projects and
          blog posts.
        </p>
      </div>
    </div>
  );
}
