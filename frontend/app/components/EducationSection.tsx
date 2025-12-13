"use client";

import { useEffect, useState } from "react";
import { EducationCardSkeleton } from "./Skeletons";

interface Education {
  id: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string | null;
  grade: string;
  description: string;
  slug: string;
  status: string;
  display_order: number;
}

interface Module {
  id: string;
  name: string;
  code: string;
  credits: number;
  grade: string;
  academic_year: string;
  year_of_study: number;
}

export default function EducationSection() {
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [modules, setModules] = useState<Record<string, Module[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingModules, setLoadingModules] = useState<Record<string, boolean>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/education`)
      .then((res) => res.json())
      .then((data) => {
        setEducationData(data.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching education:", err);
        setError("Failed to load education. Please try again.");
        setLoading(false);
      });
  }, [apiUrl]);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetch(`${apiUrl}/api/v1/education`)
      .then((res) => res.json())
      .then((data) => {
        setEducationData(data.data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching education:", err);
        setError("Failed to load education. Please try again.");
        setLoading(false);
      });
  };

  const handleToggle = (id: string, slug: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!modules[id]) {
        setLoadingModules((prev) => ({ ...prev, [id]: true }));
        fetch(`${apiUrl}/api/v1/education/${slug}`)
          .then((res) => res.json())
          .then((data) => {
            setModules((prev) => ({ ...prev, [id]: data.data.modules || [] }));
            setLoadingModules((prev) => ({ ...prev, [id]: false }));
          })
          .catch((err) => {
            console.error("Error fetching modules:", err);
            setLoadingModules((prev) => ({ ...prev, [id]: false }));
          });
      }
    }
  };

  return (
    <section id="education" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-text-primary">Education</h2>

        {error ? (
          <div className="bg-bg-card border border-border-visible p-8 text-center rounded-lg">
            <p className="text-text-secondary mb-4">{error}</p>
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-accent-red text-white hover:bg-accent-red-hover transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <>
                <EducationCardSkeleton />
                <EducationCardSkeleton />
              </>
            ) : (
              educationData.map((edu) => (
                <div key={edu.id}>
                  <div
                    onClick={() => handleToggle(edu.id, edu.slug)}
                    className="bg-bg-card border border-border-subtle rounded-lg p-6 cursor-pointer hover:border-accent-red transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                          {edu.degree}
                        </h3>
                        <p className="text-text-secondary mb-1">
                          {edu.institution}
                        </p>
                        <p className="text-text-muted text-sm">
                          {new Date(edu.start_date).getFullYear()} -{" "}
                          {edu.end_date
                            ? new Date(edu.end_date).getFullYear()
                            : "Present"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {edu.grade && (
                          <span className="px-3 py-1 bg-accent-red/10 text-accent-red rounded-full text-sm font-medium">
                            {edu.grade}
                          </span>
                        )}
                        <span className="text-text-muted">
                          {expandedId === edu.id ? "−" : "+"}
                        </span>
                      </div>
                    </div>
                    <p className="text-text-secondary mt-4">
                      {edu.description}
                    </p>
                  </div>

                  {expandedId === edu.id && (
                    <div className="mt-4 pl-6">
                      {loadingModules[edu.id] ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="bg-bg-secondary/50 border border-border-subtle rounded p-4"
                            >
                              <div className="h-4 w-3/4 bg-bg-card/50 rounded mb-2 animate-pulse" />
                              <div className="h-3 w-1/2 bg-bg-card/50 rounded mb-2 animate-pulse" />
                              <div className="h-3 w-1/3 bg-bg-card/50 rounded animate-pulse" />
                            </div>
                          ))}
                        </div>
                      ) : modules[edu.id] && modules[edu.id].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {modules[edu.id].map((module) => (
                            <div
                              key={module.id}
                              className="bg-bg-secondary/50 border border-border-subtle rounded p-4"
                            >
                              <h4 className="font-medium text-text-primary mb-1">
                                {module.name}
                              </h4>
                              <p className="text-sm text-text-muted mb-1">
                                {module.code}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-text-secondary">
                                <span>Grade: {module.grade}</span>
                                <span>{module.credits} credits</span>
                                <span>Year {module.year_of_study}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-text-muted">No modules found</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* CTA to full CV page */}
        {!error && (
          <div className="mt-8 text-center">
            <a
              href="/cv"
              className="inline-block px-8 py-3 bg-transparent border border-accent-red text-accent-red hover:bg-accent-red hover:text-text-primary transition-colors font-medium"
            >
              View Comprehensive CV →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
