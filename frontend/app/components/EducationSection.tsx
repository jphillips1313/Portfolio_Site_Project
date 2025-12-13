"use client";

import { useEffect, useState } from "react";

interface Module {
  id: string;
  name: string;
  code: string;
  grade: string;
  credits: number;
  semester: number;
  description: string;
  detailed_content: {
    academic_year: string;
    year_of_study: number;
  };
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  grade: string;
  description: string;
  slug: string;
}

export default function EducationSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [educationData, setEducationData] = useState<Education[]>([]);
  const [modules, setModules] = useState<{ [key: string]: Module[] }>({});
  const [loading, setLoading] = useState(true);

  // Fetch education data on mount
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/education")
      .then((res) => res.json())
      .then((data) => {
        setEducationData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch education:", err);
        setLoading(false);
      });
  }, []);

  const handleToggle = async (id: string, slug: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);

      // Fetch modules if we don't have them yet
      if (!modules[id]) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/v1/education/${slug}`
          );
          const data = await response.json();
          setModules({ ...modules, [id]: data.data.modules || [] });
        } catch (err) {
          console.error("Failed to fetch modules:", err);
        }
      }
    }
  };

  if (loading) {
    return (
      <section id="education" className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-text-secondary">Loading education...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="mb-12">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
            Academic Background
          </p>
          <h2 className="text-5xl font-heading font-semibold">Education</h2>
        </div>

        {/* Education List */}
        <div className="flex flex-col gap-[1px] bg-border-visible border border-border-visible">
          {educationData.map((edu) => (
            <div key={edu.id} className="bg-bg-card transition-colors">
              {/* Clickable Header */}
              <div
                className="p-8 cursor-pointer hover:bg-bg-secondary"
                onClick={() => handleToggle(edu.id, edu.slug)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-semibold mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-text-secondary text-sm mb-1">
                      {edu.institution} •{" "}
                      {new Date(edu.start_date).getFullYear()} -{" "}
                      {edu.end_date
                        ? new Date(edu.end_date).getFullYear()
                        : "Present"}
                    </p>
                    <p className="text-text-secondary text-sm">
                      {edu.description}
                    </p>
                  </div>

                  <div className="text-right ml-8">
                    <div className="text-2xl font-heading font-semibold mb-1">
                      {edu.grade}
                    </div>
                    <p className="text-text-secondary text-sm">
                      {modules[edu.id]?.length || "..."} modules
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded Content - Show Modules (Outside clickable area) */}
              {expandedId === edu.id && modules[edu.id] && (
                <div className="px-8 pb-8">
                  <div className="pt-6 border-t border-border-subtle">
                    <div className="grid grid-cols-2 gap-4">
                      {modules[edu.id].map((module) => (
                        <div
                          key={module.id}
                          className="border border-border-subtle p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-heading font-medium text-text-primary">
                              {module.name}
                            </h4>
                            <span className="text-accent-red text-sm font-semibold">
                              {module.grade}
                            </span>
                          </div>
                          <p className="text-text-muted text-xs mb-1">
                            {module.code} • {module.credits} credits
                          </p>
                          {module.detailed_content?.academic_year && (
                            <p className="text-text-muted text-xs">
                              {module.detailed_content.academic_year}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
