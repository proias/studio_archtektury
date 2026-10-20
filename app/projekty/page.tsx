import type { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { portfolioProjects } from "@/lib/projects";
export const metadata: Metadata = {
  title: "Projekty",
  description:
    "Projekty domów, obiektów usługowych i wnętrz — portfolio Pauliny Cywińskiej.",
};
export default function ProjectsPage() {
  return (
    <main id="main-content" className="section container projects-page">
      <p className="eyebrow">Portfolio</p>
      <h1>Projekty</h1>
      <p className="page-intro">
        Architektura i wnętrza. Różne potrzeby, spójne podejście do przestrzeni.
      </p>
      <ProjectGrid projects={portfolioProjects} filters />
    </main>
  );
}
