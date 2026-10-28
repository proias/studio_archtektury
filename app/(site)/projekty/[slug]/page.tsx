import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectGallery } from "@/components/project-gallery";
import {
  getProjectBySlug,
  getProjectSlugs,
  getPortfolioNavigation,
} from "@/lib/cms/reader";
import { canonicalUrl } from "@/lib/deployment";
import { indexingEnabled } from "@/lib/indexing-policy.mjs";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return { title: "Nie znaleziono projektu" };
  const description =
    project.seo?.description ||
    project.description ||
    `Galeria wizualizacji: ${project.title}.`;
  const image = project.seo?.image || project.cover;
  const url = canonicalUrl(`/projekty/${project.slug}`);
  return {
    title: project.seo?.title || project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: project.seo?.title || project.title,
      description,
      url,
      images: [
        {
          url: image.src,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    robots: { index: indexingEnabled(), follow: indexingEnabled() },
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
          {project.contentStatus === "temporary" && (
            <p className="project-content-notice">
              Opis tymczasowy — w przygotowaniu redakcyjnym.
            </p>
          )}
          {project.description && <p>{project.description}</p>}
          {project.location && (
            <dl>
              <div>
                <dt>Lokalizacja</dt>
                <dd>{project.location}</dd>
              </div>
            </dl>
          )}
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
