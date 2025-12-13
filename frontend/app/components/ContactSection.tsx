export default function ContactSection() {
  return (
    <section id="contact" className="py-24 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
            Get In Touch
          </p>
          <h2 className="text-5xl font-heading font-semibold mb-6">
            Let's Work Together
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Interested in collaborating or have a question? Feel free to reach
            out.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <a
            href="mailto:jackphillips1313@gmail.com"
            className="px-8 py-3.5 bg-bg-primary border border-accent-red text-text-primary hover:bg-accent-red transition-colors no-underline font-medium"
          >
            Send Email
          </a>
          <a
            href="/cv.pdf"
            download
            className="px-8 py-3.5 bg-transparent border border-border-visible text-text-primary hover:border-text-primary transition-colors no-underline font-medium"
          >
            Download CV
          </a>
        </div>
        <div className="flex justify-center gap-8 mb-16">
          <a
            href="https://github.com/jphillips1313"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-red transition-colors text-sm no-underline"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/jack-phillips-425732222"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent-red transition-colors text-sm no-underline"
          >
            LinkedIn
          </a>
        </div>
        <div className="text-center pt-8 border-t border-border-subtle">
          <p className="text-text-muted text-sm">
            © 2025 Jack Phillips. Built with Go, PostgreSQL, and Next.js.
          </p>
        </div>
      </div>
    </section>
  );
}
