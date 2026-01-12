"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/v1/blog/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Blog post not found");
          } else {
            setError("Failed to load blog post");
          }
          return;
        }

        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a] flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            {error === "Blog post not found" ? "404" : "Error"}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {error || "Blog post not found"}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              ← Go Back
            </button>
            <Link
              href="/blog"
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              All Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a]">
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          ← Back to blog
        </Link>

        {/* Post Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            {post.featured && (
              <span className="px-3 py-1 bg-red-900/30 text-red-300 rounded text-sm font-medium">
                Featured
              </span>
            )}
            {post.series && (
              <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded text-sm font-medium">
                {post.series}
                {post.series_order && ` #${post.series_order}`}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.published_at && (
            <div className="flex items-center gap-4 text-gray-400">
              <time>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.reading_time_minutes && (
                <>
                  <span>•</span>
                  <span>{post.reading_time_minutes} min read</span>
                </>
              )}
              <>
                <span>•</span>
                <span>{post.view_count} views</span>
              </>
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="mb-12">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full rounded-lg border border-gray-800"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-gray-300 leading-relaxed whitespace-pre-wrap"
            style={{
              fontSize: "1.125rem",
              lineHeight: "1.75",
            }}
          >
            {post.content}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex justify-between items-center">
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← All posts
            </Link>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
