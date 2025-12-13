export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-24">
      <div className="max-w-7xl mx-auto px-8 py-20 w-full">
        <div className="flex gap-16 items-center">
          {/* Left: Content */}
          <div className="flex-[6]">
            <p className="text-text-muted text-sm uppercase tracking-wider mb-4">
              Software Engineer
            </p>
            <h1 className="text-6xl font-heading font-semibold mb-6 leading-tight">
              Jack Phillips
            </h1>
            <p className="text-text-secondary text-xl leading-relaxed mb-10 max-w-2xl">
              Physics graduate turned software engineer. I build full-stack
              applications with Go, PostgreSQL, and modern web technologies.
              Currently completing MSc Software Engineering at Cardiff
              University.
            </p>
            <div className="flex gap-4">
              <a
                href="#work"
                className="px-8 py-3.5 bg-bg-primary border border-accent-red text-text-primary hover:bg-accent-red transition-colors no-underline font-medium"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 bg-transparent border border-border-visible text-text-primary hover:border-text-primary transition-colors no-underline font-medium"
              >
                Download CV
              </a>
            </div>
          </div>

          {/* Right: Stats Card */}
          <div className="flex-[4] bg-bg-card border border-border-visible p-10">
            <div className="space-y-8">
              <div>
                <div className="text-5xl font-heading font-semibold mb-1">
                  23
                </div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">
                  Technologies
                </div>
              </div>
              <div>
                <div className="text-5xl font-heading font-semibold mb-1">
                  5
                </div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">
                  Active Projects
                </div>
              </div>
              <div>
                <div className="text-5xl font-heading font-semibold mb-1">
                  2
                </div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">
                  Degrees
                </div>
              </div>
              <div>
                <div className="text-5xl font-heading font-semibold mb-1">
                  4
                </div>
                <div className="text-text-secondary text-sm uppercase tracking-wide">
                  Years Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
