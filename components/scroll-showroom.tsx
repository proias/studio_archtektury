"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, createScope, createTimeline, onScroll } from "animejs";
import { ArrowDown, ArrowUpRight, MoveUpRight, Plus } from "lucide-react";
import { pageCopy } from "@/lib/page-content";
import { TextLines } from "./text-lines";
import type { ProjectCard } from "@/lib/projects";

export function ScrollShowroom({
  project,
  description,
}: {
  project: ProjectCard;
  description: string;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const track = element.querySelector<HTMLElement>(".showroom-track")!;
    const stage = element.querySelector<HTMLElement>(".showroom-sticky")!;
    const headerHeight = () =>
      document.querySelector(".site-header")?.getBoundingClientRect().height ||
      84;
    const scope = createScope({
      root: element,
      mediaQueries: {
        desktop: "(min-width: 900px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
    }).add((self) => {
      if (!self) return;
      const { desktop, reduced } = self.matches;
      element.dataset.motion = reduced
        ? "static"
        : desktop
          ? "desktop"
          : "mobile";
      if (reduced) return;

      if (desktop) {
        createTimeline({
          defaults: { ease: "linear" },
          autoplay: onScroll({
            target: track,
            enter: () => `top+=${headerHeight()} top`,
            leave: () => `top+=${headerHeight()} bottom-=${stage.clientHeight}`,
            sync: true,
          }),
        })
          .add(
            ".showroom-picture",
            { scale: [1, 0.64], y: [0, 26], duration: 1000, ease: "inOut(3)" },
            0,
          )
          .add(
            ".showroom-picture > img",
            { scale: [1.06, 1], duration: 1000 },
            0,
          )
          .add(
            ".hero-project-caption, .showroom-picture > .image-label",
            { opacity: [1, 0], y: [0, -16], duration: 220 },
            40,
          )
          .add(".showroom-scroll-hint", { opacity: [1, 0], duration: 150 }, 0)
          .add(
            ".showroom-project-title",
            { opacity: [0, 1], y: [35, 0], duration: 200 },
            650,
          )
          .add(
            ".showroom-project-copy",
            { opacity: [0, 1], x: [65, 0], duration: 300 },
            700,
          );
      } else {
        animate(".showroom-picture > img", {
          y: [0, -22],
          scale: [1.06, 1],
          ease: "linear",
          autoplay: onScroll({
            target: ".showroom-picture",
            enter: "center center",
            leave: "top bottom",
            sync: true,
          }),
        });
        animate(".showroom-project-copy", {
          y: [24, 0],
          opacity: [0.35, 1],
          ease: "linear",
          autoplay: onScroll({
            target: ".showroom-project-copy",
            enter: "bottom top",
            leave: "center center",
            sync: true,
          }),
        });
      }
    });

    // Anchor links land on the finished case study rather than a hidden title
    // midway through the sticky scene. Ordinary wheel/touch scrolling stays native.
    let programmaticFocus = false;
    const goToPortfolio = (behavior: ScrollBehavior, focusHeading = false) => {
      if (element.dataset.motion !== "desktop") return;
      const top =
        track.getBoundingClientRect().top +
        window.scrollY +
        track.offsetHeight -
        stage.offsetHeight -
        headerHeight();
      window.scrollTo({ top, behavior });
      if (focusHeading) {
        programmaticFocus = true;
        element
          .querySelector<HTMLElement>("#portfolio-heading")
          ?.focus({ preventScroll: true });
        programmaticFocus = false;
      }
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (
        !link ||
        link.target === "_blank" ||
        element.dataset.motion !== "desktop"
      )
        return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.hash !== "#portfolio"
      )
        return;
      event.preventDefault();
      if (location.hash !== "#portfolio")
        history.pushState(null, "", "#portfolio");
      goToPortfolio("smooth", true);
    };
    const hashChange = () => {
      if (location.hash === "#portfolio") goToPortfolio("instant");
    };
    document.addEventListener("click", onClick, true);
    const onFocus = (event: FocusEvent) => {
      if (programmaticFocus) return;
      if (
        (event.target as Element).closest(
          ".showroom-project-title, .showroom-project-copy",
        )
      )
        goToPortfolio("instant");
    };
    element.addEventListener("focusin", onFocus);
    window.addEventListener("hashchange", hashChange);
    const initialAnchor = requestAnimationFrame(hashChange);
    return () => {
      cancelAnimationFrame(initialAnchor);
      document.removeEventListener("click", onClick, true);
      element.removeEventListener("focusin", onFocus);
      window.removeEventListener("hashchange", hashChange);
      scope.revert();
      delete element.dataset.motion;
    };
  }, []);

  return (
    <section
      ref={root}
      className="scroll-showroom"
      data-section="Projekty"
      aria-labelledby="hero-heading"
    >
      <div className="atelier-intro container">
        <div className="technical-line">
          <span>
            <i /> Łódź · Warszawa · i dalej
          </span>
          <span>Domy / Wnętrza / Przestrzenie</span>
        </div>
        <div className="atelier-hero-heading">
          <h1 id="hero-heading">
            {pageCopy.intro.headingFirst}
            <br />
            {pageCopy.intro.headingSecond === "dopasowana do życia." ? (
              <>
                dopasowana
                <br />
                do{" "}
                <span className="life-word">
                  życia<span className="life-dot">.</span>
                </span>
              </>
            ) : (
              <TextLines text={pageCopy.intro.headingSecond} />
            )}
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
      <div className="showroom-track">
        <div className="showroom-sticky container">
          <Link
            href={`/projekty/${project.slug}`}
            className="hero hero-project showroom-picture"
            aria-label={`Poznaj projekt: ${project.title}`}
          >
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="(min-width: 1600px) 1472px, 100vw"
              priority
              style={{
                objectFit: project.cover.objectFit,
                objectPosition: project.cover.objectPosition,
              }}
            />
            <span className="image-label">
              Wybrane z portfolio <Plus size={13} />
            </span>
            <span className="hero-project-caption">
              <span>
                <small>Architektura / {project.location}</small>
                <strong>{project.title}</strong>
              </span>
              <ArrowUpRight size={25} />
            </span>
          </Link>
          <div
            id="portfolio"
            className="showroom-project-title section-heading"
          >
            <div>
              <p className="eyebrow">01 / {pageCopy.portfolio.eyebrow}</p>
              <h2 id="portfolio-heading" tabIndex={-1}>
                {pageCopy.portfolio.heading}
                <span className="blue-dot">.</span>
              </h2>
            </div>
            <Link className="text-link" href="/projekty">
              {pageCopy.portfolio.allProjectsLink}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <article className="featured-project showroom-project-copy">
            <div className="featured-project-copy">
              <span className="project-index" aria-hidden="true">
                01
              </span>
              <p className="eyebrow">
                {project.category} / {project.location}
              </p>
              <h3>{project.title}</h3>
              <p>{description.split(". ")[0]}.</p>
              <dl>
                <div>
                  <dt>Lokalizacja</dt>
                  <dd>{project.location}</dd>
                </div>
                <div>
                  <dt>Materiał</dt>
                  <dd>Wizualizacje</dd>
                </div>
              </dl>
              <Link className="solid-link" href={`/projekty/${project.slug}`}>
                Poznaj projekt
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
          <div className="showroom-scroll-hint" aria-hidden="true">
            <span>Przewiń, by odkryć projekt</span>
            <ArrowDown size={16} />
          </div>
        </div>
      </div>
    </section>
  );
}
