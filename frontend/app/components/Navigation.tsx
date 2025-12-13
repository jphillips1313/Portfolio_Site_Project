"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="sticky top-0 left-0 right-0 bg-bg-primary/80 backdrop-blur-sm border-b border-border-subtle z-50">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link
            href="/"
            className="font-heading text-xl font-semibold text-text-primary"
          >
            JP
          </Link>
          <ul className="flex gap-10 list-none m-0 p-0">
            <li>
              <a
                href="#work"
                className="inline-block text-text-primary text-[15px] no-underline hover:text-accent-red transition-colors whitespace-nowrap"
              >
                Work
              </a>
            </li>
            <li>
              <a
                href="#education"
                className="inline-block text-text-primary text-[15px] no-underline hover:text-accent-red transition-colors whitespace-nowrap"
              >
                Education
              </a>
            </li>
            <li>
              <a
                href="#skills"
                className="inline-block text-text-primary text-[15px] no-underline hover:text-accent-red transition-colors whitespace-nowrap"
              >
                Skills
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="inline-block text-text-primary text-[15px] no-underline hover:text-accent-red transition-colors whitespace-nowrap"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
