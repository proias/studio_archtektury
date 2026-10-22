import type { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { pageCopy } from "@/lib/page-content";
import { canonicalUrl } from "@/lib/deployment";
import { projectCard } from "@/lib/projects";
import { getAllProjects, selectPortfolioProjects } from "@/lib/cms/reader";
export const metadata: Metadata = {
  title: pageCopy.catalog.heading,
  description: pageCopy.catalog.seoDescription,
  alternates: { canonical: canonicalUrl("/projekty") },
};
export default async function ProjectsPage() {
  const portfolioProjects = selectPortfolioProjects(await getAllProjects());
  return (
    <main id="main-content" className="section container projects-page">
      <p className="eyebrow">{pageCopy.catalog.eyebrow}</p>
      <h1>{pageCopy.catalog.heading}</h1>
      <p className="page-intro">{pageCopy.catalog.description}</p>
      <ProjectGrid projects={portfolioProjects.map(projectCard)} filters />
    </main>
  );
}
