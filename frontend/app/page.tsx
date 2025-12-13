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
      <Hero />
      <EducationSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
