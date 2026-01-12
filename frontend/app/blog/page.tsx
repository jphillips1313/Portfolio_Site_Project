"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: string;
  published_at: string | null;
  reading_time_minutes: number | null;
  view_count: number;
  featured: boolean;
  series: string | null;
  series_order: number | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/v1/blog`);
        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        setError("Failed to load blog posts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-800 rounded w-1/3"></div>
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-4">
                <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-400">
            Thoughts on software development, technology, and learning
          </p>
        </div>

        {/* Blog Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No blog posts yet</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-[#1a0a0f] border border-gray-800 rounded-lg p-8 hover:border-red-400 transition-all">
                    {/* Post Header */}
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        {post.featured && (
                          <span className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs font-medium">
                            Featured
                          </span>
                        )}
                        {post.series && (
                          <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs font-medium">
                            {post.series}
                            {post.series_order && ` #${post.series_order}`}
                          </span>
                        )}
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                        {post.title}
                      </h2>
                      {post.published_at && (
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <time>
                            {new Date(post.published_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </time>
                          {post.reading_time_minutes && (
                            <span>• {post.reading_time_minutes} min read</span>
                          )}
                          <span>• {post.view_count} views</span>
                        </div>
                      )}
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-300 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read More Link */}
                    <div className="text-red-400 group-hover:text-red-300 transition-colors font-medium">
                      Read more →
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
