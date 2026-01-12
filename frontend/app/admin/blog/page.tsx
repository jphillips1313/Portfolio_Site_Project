"use client";

import { useAuth } from "@/app/contexts/AuthContext";
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

export default function BlogAdmin() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BlogPost>>({});
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    status: "draft",
    featured: false,
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  const fetchPosts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/admin/blog`, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError("Failed to load blog posts");
      console.error(err);
      setPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (post: BlogPost) => {
    setEditingId(post.id);
    setEditForm(post);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const startCreating = () => {
    setCreating(true);
    setNewPost({
      status: "draft",
      featured: false,
    });
  };

  const cancelCreating = () => {
    setCreating(false);
    setNewPost({
      status: "draft",
      featured: false,
    });
  };

  const savePost = async (postId: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setSaving(postId);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/admin/blog/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      const data = await response.json();

      // Validate the response data
      if (data.data && data.data.id) {
        setPosts((prev) =>
          prev.map((post) => (post.id === postId ? data.data : post))
        );
        setSuccessMessage("Post updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        cancelEditing();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setSaving(null);
    }
  };

  const createPost = async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!newPost.title || !newPost.content) {
      setError("Title and content are required");
      return;
    }

    setSaving("new");
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/admin/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();

      // Validate the response data
      if (data.data && data.data.id) {
        setPosts((prev) => [data.data, ...prev]);
        setSuccessMessage("Post created successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        cancelCreating();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setSaving(null);
    }
  };

  const deletePost = async (postId: string) => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    setDeleting(postId);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/admin/blog/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setSuccessMessage("Post deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Blog Posts</h1>
        <p className="text-gray-400">
          Manage your blog posts, drafts, and published content
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg text-green-300">
          {successMessage}
        </div>
      )}

      {/* Create New Post Button */}
      {!creating && (
        <button
          onClick={startCreating}
          className="mb-6 px-6 py-3 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors font-medium"
        >
          + Create New Post
        </button>
      )}

      {/* Create New Post Form */}
      {creating && (
        <div className="mb-6 bg-[#1a0a0f] rounded-lg border border-green-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Create New Blog Post
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newPost.title || ""}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Slug (auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={newPost.slug || ""}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900"
                  placeholder="post-slug"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Excerpt
              </label>
              <textarea
                value={newPost.excerpt || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={2}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900"
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                value={newPost.content || ""}
                onChange={(e) =>
                  setNewPost((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={12}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900 font-mono text-sm"
                placeholder="Write your post content (Markdown supported)..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={newPost.status || "draft"}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Reading Time (min)
                </label>
                <input
                  type="number"
                  value={newPost.reading_time_minutes || ""}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      reading_time_minutes: parseInt(e.target.value) || null,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-900"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Featured
                </label>
                <input
                  type="checkbox"
                  checked={newPost.featured || false}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="mt-3 w-5 h-5 bg-gray-900 border-gray-800 rounded"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={createPost}
                disabled={saving === "new"}
                className="px-6 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                {saving === "new" ? "Creating..." : "Create Post"}
              </button>
              <button
                onClick={cancelCreating}
                disabled={saving === "new"}
                className="px-6 py-2 bg-gray-900/30 hover:bg-gray-900/50 text-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-[#1a0a0f] rounded-lg p-12 border border-gray-800 text-center">
            <p className="text-gray-400">No blog posts yet</p>
          </div>
        ) : (
          posts.map((post) => {
            const isEditing = editingId === post.id;
            const isSaving = saving === post.id;
            const isDeleting = deleting === post.id;

            return (
              <div
                key={post.id}
                className={`bg-[#1a0a0f] rounded-lg border transition-all ${
                  isEditing
                    ? "border-blue-700 shadow-lg shadow-blue-900/20"
                    : "border-gray-800"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {post.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            post.status === "published"
                              ? "bg-green-900/30 text-green-300"
                              : "bg-yellow-900/30 text-yellow-300"
                          }`}
                        >
                          {post.status}
                        </span>
                        {post.featured && (
                          <span className="px-2 py-1 text-xs bg-red-900/30 text-red-300 rounded">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{post.slug}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => startEditing(post)}
                            className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => savePost(post.id)}
                            disabled={isSaving}
                            className="px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="px-4 py-2 bg-gray-900/30 hover:bg-gray-900/50 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {!isEditing ? (
                    <div className="space-y-3 text-sm">
                      {post.excerpt && (
                        <p className="text-gray-300">{post.excerpt}</p>
                      )}
                      <div className="flex gap-4 text-gray-400">
                        {post.reading_time_minutes && (
                          <span>{post.reading_time_minutes} min read</span>
                        )}
                        <span>{post.view_count} views</span>
                        {post.published_at && (
                          <span>
                            Published:{" "}
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={editForm.title || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Slug
                          </label>
                          <input
                            type="text"
                            value={editForm.slug || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                slug: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Excerpt
                        </label>
                        <textarea
                          value={editForm.excerpt || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              excerpt: e.target.value,
                            }))
                          }
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">
                          Content
                        </label>
                        <textarea
                          value={editForm.content || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          rows={12}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Status
                          </label>
                          <select
                            value={editForm.status || "draft"}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                status: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Reading Time (min)
                          </label>
                          <input
                            type="number"
                            value={editForm.reading_time_minutes || ""}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                reading_time_minutes:
                                  parseInt(e.target.value) || null,
                              }))
                            }
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">
                            Featured
                          </label>
                          <input
                            type="checkbox"
                            checked={editForm.featured || false}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                featured: e.target.checked,
                              }))
                            }
                            className="mt-3 w-5 h-5 bg-gray-900 border-gray-800 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
