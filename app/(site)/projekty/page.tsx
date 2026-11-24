import type { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { pageCopy } from "@/lib/page-content";
import { canonicalUrl } from "@/lib/deployment";
import { projectCard } from "@/lib/projects";
import { getAllProjects, selectPortfolioProjects } from "@/lib/cms/reader";
export const metadata: Metadata = {
  title: "Projekty architektury i wnętrz w Łodzi",
  description: pageCopy.catalog.seoDescription,
  alternates: { canonical: canonicalUrl("/projekty") },
  openGraph: {
    title: "Projekty architektury i wnętrz w Łodzi",
    description: pageCopy.catalog.seoDescription,
    url: canonicalUrl("/projekty"),
  },
  twitter: {
    title: "Projekty architektury i wnętrz w Łodzi",
    description: pageCopy.catalog.seoDescription,
  },
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
