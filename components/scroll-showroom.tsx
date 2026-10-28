import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveUpRight, Plus } from "lucide-react";
import { pageCopy } from "@/lib/page-content";
import type { ProjectCard } from "@/lib/projects";

export function ScrollShowroom({ project }: { project: ProjectCard }) {
  const lines =
    pageCopy.intro.headingSecond === "dopasowana do życia."
      ? [pageCopy.intro.headingFirst, "dopasowana", "do życia."]
      : [
          pageCopy.intro.headingFirst,
          ...pageCopy.intro.headingSecond.split("\n"),
        ];
  return (
    <section
      className="scroll-showroom kinetic-hero"
      data-section="01 / Początek"
      aria-labelledby="hero-heading"
    >
      <div className="atelier-intro container">
        <div className="technical-line hero-metadata">
          <span>
            <i /> Łódź / 51.7592° N · 19.4560° E
          </span>
          <span>2026 / Autorska pracownia</span>
        </div>
        <div className="atelier-hero-heading">
          <h1 id="hero-heading">
            {lines.map((line, index) => (
              <span className="hero-line-mask" key={index}>
                <span className="hero-line">
                  {line.endsWith(".") ? (
                    <>
                      {line.slice(0, -1)}
                      <span className="life-dot">.</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>
          <div className="hero-aside">
            <span className="hero-symbol" aria-hidden="true">
              <MoveUpRight strokeWidth={0.7} />
            </span>
            <p>{pageCopy.intro.description}</p>
            <a href="#portfolio" className="solid-link">
              {pageCopy.intro.projectsLink}
              <ArrowDown size={17} />
            </a>
          </div>
        </div>
      </div>
      <div className="hero-frame-boundary container">
        <Link
          href={`/projekty/${project.slug}`}
          className="hero hero-project kinetic-hero-frame"
          aria-label={`Poznaj projekt: ${project.title}`}
        >
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(min-width: 1600px) 1295px, 88vw"
            priority
            style={{
              objectFit: project.cover.objectFit,
              objectPosition: project.cover.objectPosition,
            }}
          />
          <span className="image-label hero-technical-tag">
            {project.title} · {project.year || "Portfolio"}
            <Plus size={13} />
          </span>
          <span className="hero-project-caption">
            <span>
              <small>Architektura / {project.location}</small>
              <strong>Przestrzeń zaczyna się od Ciebie.</strong>
            </span>
            <ArrowUpRight size={25} />
          </span>
        </Link>
      </div>
      <div className="image-footnote container hero-metadata">
        <span>Domy / Wnętrza / Przestrzenie</span>
        <a href="#manifest">
          Poznaj podejście pracowni
          <ArrowDown size={13} />
        </a>
      </div>
    </section>
  );
}
