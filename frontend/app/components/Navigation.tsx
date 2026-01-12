"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/cv", label: "CV" },
    { href: "/blog", label: "Blog" },
    { href: "#work", label: "Work" },
    { href: "#skills", label: "Skills" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 bg-bg-primary/90 backdrop-blur-md border-b border-border-visible z-50">
        <div className="px-6 md:px-8 py-5">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Logo/Name */}
            <Link
              href="/"
              className="font-heading text-xl md:text-2xl font-bold text-text-primary hover:text-accent-red transition-colors"
            >
              Jack Phillips
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex gap-8 list-none m-0 p-0">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-block text-text-primary text-base font-medium no-underline hover:text-accent-red transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent-red after:transition-all hover:after:w-full"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Admin Link */}
              <Link
                href="/admin"
                className="text-text-muted hover:text-accent-red text-sm font-medium transition-colors px-3 py-1 border border-border-subtle rounded hover:border-accent-red"
              >
                Admin
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-text-primary hover:text-accent-red transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-bg-secondary border-l border-border-visible z-[70] md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-text-primary hover:text-accent-red transition-colors"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Links */}
        <ul className="flex flex-col gap-2 px-6 list-none m-0 p-0">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleNavClick}
                className="block py-4 text-text-primary text-lg font-medium no-underline hover:text-accent-red hover:translate-x-2 transition-all border-b border-border-subtle"
              >
                {link.label}
              </a>
            </li>
          ))}

          {/* Admin Link */}
          <li>
            <Link
              href="/admin"
              onClick={handleNavClick}
              className="block py-4 text-text-muted text-lg font-medium hover:text-accent-red hover:translate-x-2 transition-all"
            >
              Admin →
            </Link>
          </li>
        </ul>

        {/* Optional: Add social links or other content */}
        <div className="absolute bottom-8 left-6 right-6">
          <p className="text-text-muted text-sm">Jack Phillips</p>
          <p className="text-text-muted text-xs mt-1">Software Engineer</p>
        </div>
      </div>
    </>
  );
}
