import AboutSection from "./components/AboutSection";
import BackToTop from "./components/BackToTop";
import ContactSection from "./components/ContactSection";
import EducationSection from "./components/EducationSection";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AboutSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <BackToTop />
    </>
  );
}
