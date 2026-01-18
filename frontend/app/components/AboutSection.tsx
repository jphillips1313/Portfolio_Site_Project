export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Header */}
        <p className="text-text-muted text-xs uppercase tracking-wider mb-2">
          About Me
        </p>
        <h2 className="text-4xl font-heading font-semibold mb-8">
          Aspiring Software Engineer
        </h2>

        <div className="space-y-8">
          {/* First section - Photo and Text side by side */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo - Fixed width, stays on left */}
            <div className="flex-shrink-0 w-full md:w-64 h-64 bg-bg-card border border-border-visible rounded-lg overflow-hidden">
              <img
                src="/jack_graduation.jpg"
                alt="Jack Phillips - Graduation"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text content - Grows with content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  I started my journey in academics with a BSc is Physics from
                  the university of salford, where I explored high-pressure
                  fluid dynamics using diamond anvil cells. This disseration
                  attributed to an academic paper being published.
                </p>

                <p>
                  From this degree I found that the aspects i enjoyed the most
                  were the computational aspects. With modules including
                  modelling physics in MATLAB and Python. I realised I had a
                  passion for this type of problem solving. This led me to
                  pursue an MSc in Software Engineering at Cardiff University,
                  where I'm learning to build production-ready applications with
                  modern technologies.
                </p>

                <p>
                  Through this MSc I have been gaining a strong foundation as a
                  Full-Stack developer. Learning Java, JavaScript, SpringBoot
                  and basic web development. I have also been gaining experience
                  outside of the course by taking on projects and learning new
                  technologies, such as React, Next.js, Tailwind CSS, and Go.
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
