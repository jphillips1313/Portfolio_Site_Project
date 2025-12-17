import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import BackToTop from "./components/BackToTop";
import Navigation from "./components/Navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "Jack Phillips | Software Engineer",
  description:
    "Software Engineer specializing in Go, PostgreSQL, React, and TypeScript. MSc Software Engineering graduate from Cardiff University with a background in Physics.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "Go",
    "PostgreSQL",
    "React",
    "TypeScript",
    "Next.js",
    "Cardiff",
    "Wales",
  ],
  authors: [{ name: "Jack Phillips" }],
  creator: "Jack Phillips",

  // Open Graph (Facebook, LinkedIn, Discord)
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://jackphillips.dev", // Update when deployed
    title: "Jack Phillips | Software Engineer",
    description:
      "Software Engineer specializing in Go, PostgreSQL, React, and TypeScript. MSc Software Engineering graduate from Cardiff University.",
    siteName: "Jack Phillips Portfolio",
    images: [
      {
        url: "/og-image.png", // We'll create this later
        width: 1200,
        height: 630,
        alt: "Jack Phillips - Software Engineer",
      },
    ],
  },

  // Additional Meta
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add when you have accounts)
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content="#1a0a0f" />
        <meta name="color-scheme" content="dark" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased">
        <Navigation />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
