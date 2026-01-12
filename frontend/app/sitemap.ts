import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
  ];

  // Fetch blog posts for dynamic URLs
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${apiUrl}/api/v1/blog`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();
      const blogPosts = data.data || [];

      const blogUrls = blogPosts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

      return [...staticPages, ...blogUrls];
    }
  } catch (error) {
    console.error("Error fetching blog posts for sitemap:", error);
  }

  // Fetch projects for dynamic URLs
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${apiUrl}/api/v1/projects`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      const projects = data.data || [];

      const projectUrls = projects.map((item: any) => ({
        url: `${baseUrl}/projects/${item.project?.slug || item.slug}`,
        lastModified: new Date(item.project?.updated_at || item.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

      return [...staticPages, ...projectUrls];
    }
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  return staticPages;
}
