import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "7xl": "80rem",
      },
      colors: {
        "bg-primary": "#1a0a0f",
        "bg-secondary": "#250d15",
        "bg-card": "#3a1a25",
        "text-primary": "#f5e8ed",
        "text-secondary": "#d4b8c4",
        "text-muted": "#9a7684",
        "accent-red": "#e63946",
        "accent-red-hover": "#d62839",
        "accent-coral": "#f77f8e",
        "border-subtle": "#4a2a35",
        "border-visible": "#5a3545",
      },
    },
  },
  plugins: [],
};

export default config;
