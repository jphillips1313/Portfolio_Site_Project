"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message:
            data.message ||
            "Message sent successfully! I'll get back to you soon.",
        });
        // Clear form on success
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message:
            data.error ||
            "Failed to send message. Please try again or email me directly at jackphillips1313@gmail.com",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        type: "error",
        message:
          "Failed to send message. Please try again or email me directly at jackphillips1313@gmail.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-visible py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="text-text-secondary hover:text-accent-red transition-colors text-sm"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </header>

      {/* Contact Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
            Get In Touch
          </p>
          <h1 className="text-5xl font-heading font-bold mb-4">
            Let's Work Together
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'd love to
            hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-bg-card border border-border-visible rounded-lg p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-text-primary text-sm font-medium mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-primary border border-border-visible text-text-primary focus:border-accent-red focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-text-primary text-sm font-medium mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-bg-primary border border-border-visible text-text-primary focus:border-accent-red focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-text-primary text-sm font-medium mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-primary border border-border-visible text-text-primary focus:border-accent-red focus:outline-none transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-text-primary text-sm font-medium mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-bg-primary border border-border-visible text-text-primary focus:border-accent-red focus:outline-none transition-colors resize-none"
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>

              {/* Status Message */}
              {status.type && (
                <div
                  className={`p-4 rounded-lg border ${
                    status.type === "success"
                      ? "bg-green-900/20 border-green-800 text-green-300"
                      : "bg-red-900/20 border-red-800 text-red-300"
                  }`}
                >
                  {status.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-accent-red text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-bg-card border border-border-visible rounded-lg p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-text-muted text-xs uppercase mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:jackphillips1313@gmail.com"
                    className="text-text-secondary hover:text-accent-red transition-colors text-sm break-all"
                  >
                    jackphillips1313@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase mb-1">
                    Location
                  </p>
                  <p className="text-text-secondary text-sm">Cardiff, Wales</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-bg-card border border-border-visible rounded-lg p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Connect
              </h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/jphillips1313"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-secondary hover:text-accent-red transition-colors group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm">GitHub</span>
                </a>

                <a
                  href="https://linkedin.com/in/jack-phillips-425732222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-text-secondary hover:text-accent-red transition-colors group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Download CV */}
            <a
              href="/Jack_CV.pdf"
              download="Jack_Phillips_CV.pdf"
              className="block w-full px-6 py-3 bg-transparent border border-border-visible text-text-primary hover:border-accent-red transition-colors text-center font-medium"
            >
              Download CV
            </a>
          </div>
        </div>

        {/* Availability Note */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 text-center">
          <p className="text-blue-300">
            🎓 Currently completing MSc Software Engineering at Cardiff
            University. Available for full-time opportunities starting September
            2026. Also open to relocation globally.
          </p>
        </div>
      </main>
    </div>
  );
}
