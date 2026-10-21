import type { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { getAllProjects, selectPortfolioProjects } from "@/lib/cms/reader";
export const metadata: Metadata = {
  title: "Projekty",
  description:
    "Projekty domów, obiektów usługowych i wnętrz — portfolio Pauliny Cywińskiej.",
};
export default async function ProjectsPage() {
  const portfolioProjects = selectPortfolioProjects(await getAllProjects());
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
