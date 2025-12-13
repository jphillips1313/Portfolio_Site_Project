export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20 w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="flex-[6] w-full">
            <p className="text-text-muted text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-4">
              Software Engineer
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold mb-4 md:mb-6 leading-tight">
              Jack Phillips
            </h1>
            <p className="text-text-secondary text-base md:text-lg lg:text-xl leading-relaxed mb-8 md:mb-10 max-w-2xl">
              Physics graduate turned software engineer. I build full-stack
              applications with Go, PostgreSQL, and modern web technologies.
              Currently completing MSc Software Engineering at Cardiff
              University.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#work"
                className="px-6 md:px-8 py-3 md:py-3.5 bg-bg-primary border border-accent-red text-text-primary hover:bg-accent-red transition-colors no-underline font-medium text-center"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-6 md:px-8 py-3 md:py-3.5 bg-transparent border border-border-visible text-text-primary hover:border-text-primary transition-colors no-underline font-medium text-center"
              >
                Download CV
              </a>
            </div>
          </div>

          {/* Right: Stats Card */}
          <div className="flex-[4] w-full lg:w-auto bg-bg-card border border-border-visible p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-heading font-semibold mb-1">
                  23
                </div>
                <div className="text-text-secondary text-xs md:text-sm uppercase tracking-wide">
                  Technologies
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-semibold mb-1">
                  5
                </div>
                <div className="text-text-secondary text-xs md:text-sm uppercase tracking-wide">
                  Active Projects
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-semibold mb-1">
                  2
                </div>
                <div className="text-text-secondary text-xs md:text-sm uppercase tracking-wide">
                  Degrees
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-heading font-semibold mb-1">
                  4
                </div>
                <div className="text-text-secondary text-xs md:text-sm uppercase tracking-wide">
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
