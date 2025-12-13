export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Header */}
        <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
          About Me
        </p>
        <h2 className="text-4xl font-heading font-semibold mb-8">
          From Physics to Code
        </h2>

        <div className="space-y-8">
          {/* First section with photo float */}
          <div>
            {/* Photo floats left */}
            <div className="float-left w-64 h-64 mr-8 mb-4 bg-bg-card border border-border-visible rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                <div className="text-center">
                  <div className="text-6xl mb-2">👨‍💻</div>
                  <p className="text-sm">Photo coming soon</p>
                </div>
              </div>
            </div>

            {/* Text flows around photo */}
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                I started my journey in{" "}
                <strong className="text-text-primary">physics</strong>, earning
                a BSc from the University of Salford where I explored
                high-pressure fluid dynamics using diamond anvil cells. My
                dissertation even contributed to a published academic paper in
                Physics of Fluids.
              </p>

              <p>
                During my physics degree, I discovered a passion for{" "}
                <strong className="text-text-primary">
                  computational problem-solving
                </strong>{" "}
                through MATLAB projects and data analysis. This led me to pursue
                an MSc in Software Engineering at Cardiff University, where I'm
                learning to build production-ready applications with modern
                technologies.
              </p>

              <p>
                Today, I specialize in{" "}
                <strong className="text-text-primary">
                  full-stack development
                </strong>{" "}
                with Go, PostgreSQL, React, and TypeScript. I love building
                clean, efficient systems and learning new technologies.
                Currently exploring cloud architecture and DevOps practices.
              </p>
            </div>

            {/* Interests */}
            <div className="pt-6 border-t border-border-subtle">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Beyond Code
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  🧗 Bouldering
                </span>
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  ✈️ Travelling
                </span>
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  🎮 Gaming
                </span>
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  🇯🇵 Learning Japanese
                </span>
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  🇰🇷 Learning Korean
                </span>
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  ⛳ Golf
                </span>
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  🏀 Basketball
                </span>
                <span className="px-4 py-2 bg-bg-card border border-border-visible text-text-secondary text-sm rounded">
                  💻 Building PCs
                </span>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="pt-6 border-t border-border-subtle">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Quick Facts
            </h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-1">▸</span>
                <span>
                  Former Physics Society President at University of Salford
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-1">▸</span>
                <span>Selected for Wales Basketball U18's (2016)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-1">▸</span>
                <span>Published contributor to academic physics research</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-red mt-1">▸</span>
                <span>Based in Cardiff, Wales 🏴</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
