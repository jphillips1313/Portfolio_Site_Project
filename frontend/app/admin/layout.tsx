"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  console.log("AdminLayout:", { pathname, isAuthenticated, isLoading });

  useEffect(() => {
    if (
      mounted &&
      !isLoading &&
      !isAuthenticated &&
      pathname !== "/admin/login"
    ) {
      router.push("/admin/login");
    }
  }, [mounted, isAuthenticated, isLoading, router, pathname]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null;
  }

  // If on login page, render without admin nav
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // If not authenticated after loading, don't render (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, show admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0f] to-[#0a0a0a]">
      {/* Admin Navigation */}
      <nav className="bg-[#1a0a0f]/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <div className="flex items-center space-x-8">
              <Link
                href="/admin"
                className="text-white font-bold text-xl hover:text-red-400 transition"
              >
                Admin Panel
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/education"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Education
                </Link>
                <Link
                  href="/admin/modules"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Modules
                </Link>
                <Link
                  href="/admin/skills"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Skills
                </Link>
                <Link
                  href="/admin/projects"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Projects
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm hidden sm:block">
                Welcome, {user?.username}
              </span>
              <Link
                href="/"
                target="_blank"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
              >
                View Site
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
