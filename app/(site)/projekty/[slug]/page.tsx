import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectGallery } from "@/components/project-gallery";
import {
  getProjectBySlug,
  getProjectSlugs,
  getPortfolioNavigation,
} from "@/lib/cms/reader";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return { title: "Nie znaleziono projektu" };
  return {
    title: project.title,
    description:
      project.description || `Galeria wizualizacji: ${project.title}.`,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [
        {
          url: project.cover.src,
          width: project.cover.width,
          height: project.cover.height,
          alt: project.cover.alt,
        },
      ],
    },
    robots: { index: false, follow: false },
  };
}
export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug((await params).slug);
  if (!project) notFound();
  const portfolioProjects = await getPortfolioNavigation();
  const next =
    portfolioProjects[
      (portfolioProjects.findIndex((p) => p.slug === project.slug) + 1) %
        portfolioProjects.length
    ];
  return (
    <main id="main-content" className="container project-page">
      <Link href="/projekty" className="text-link back-link">
        ← Wszystkie projekty
      </Link>
      <div className="project-layout">
        <div className="project-details">
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          {project.description && <p>{project.description}</p>}
          <dl>
            <div>
              <dt>Materiał</dt>
              <dd>Wizualizacje</dd>
            </div>
            {project.location && (
              <div>
                <dt>Lokalizacja</dt>
                <dd>{project.location}</dd>
              </div>
            )}
            {project.year && (
              <div>
                <dt>Rok projektu</dt>
                <dd>{project.year}</dd>
              </div>
            )}
          </dl>
          <Link href="/#kontakt" className="text-link">
            Porozmawiajmy o projekcie ↗
          </Link>
        </div>
        <ProjectGallery images={project.images} title={project.title} />
      </div>
      {next && (
        <div className="next-project">
          <span>Kolejny projekt</span>
          <Link href={`/projekty/${next.slug}`}>{next.title} ↗</Link>
        </div>
      )}
    </main>
  );
}
