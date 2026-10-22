"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, type ProjectCard } from "@/lib/projects";
export function ProjectGrid({
  projects,
  filters = false,
}: {
  projects: ProjectCard[];
  filters?: boolean;
}) {
  const [category, setCategory] = useState("Wszystkie");
  const visible = projects.filter(
    (p) => category === "Wszystkie" || p.category === category,
  );
  return (
    <>
      {filters && (
        <div
          className="filters"
          role="group"
          aria-label="Filtruj projekty według kategorii"
        >
          {["Wszystkie", ...categories].map((item) => (
            <button
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" role="status">
        Liczba projektów: {visible.length}
      </p>
      <div className="project-grid">
        {visible.map((project) => (
          <Link
            className="project-card"
            href={`/projekty/${project.slug}`}
            key={project.slug}
          >
            <div className="project-cover">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                sizes="(min-width: 1440px) 405px, (min-width: 1024px) 30vw, (min-width: 768px) 44vw, calc(100vw - 48px)"
                style={{
                  objectPosition: project.cover.objectPosition,
                  objectFit: project.cover.objectFit,
                }}
              />
            </div>
            <div className="project-caption">
              <h3>{project.title}</h3>
              <ArrowUpRight size={18} aria-hidden="true" />
              <p>
                {project.category}
                {project.location ? ` · ${project.location}` : ""}
                {project.year ? ` · ${project.year}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
