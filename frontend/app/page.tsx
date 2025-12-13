import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import EducationSection from "./components/EducationSection";
import FadeIn from "./components/FadeIn";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";

export default function Home() {
  return (
    <>
      <Navigation />

      {/* Hero doesn't need animation - it's above the fold */}
      <Hero />

      {/* Animate sections as they scroll into view */}
      <FadeIn>
        <AboutSection />
      </FadeIn>

      <FadeIn delay={0.1}>
        <EducationSection />
      </FadeIn>

      <FadeIn delay={0.1}>
        <ProjectsSection />
      </FadeIn>

      <FadeIn delay={0.1}>
        <SkillsSection />
      </FadeIn>

      <FadeIn delay={0.1}>
        <ContactSection />
      </FadeIn>
    </>
  );
}
