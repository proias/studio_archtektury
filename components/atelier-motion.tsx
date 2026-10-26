"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { animate, createScope, onScroll } from "animejs";

export function AtelierMotion() {
  const [section, setSection] = useState("Początek");
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setSection(
              (entry.target as HTMLElement).dataset.section || "Początek",
            );
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll<HTMLElement>("[data-section]")
      .forEach((el) => observer.observe(el));
    const scope = createScope({
      root: document.querySelector<HTMLElement>(".atelier-home")!,
      mediaQueries: {
        reduced: "(prefers-reduced-motion: reduce)",
        mobile: "(max-width: 899px)",
      },
    }).add((self) => {
      if (!self) return;
      if (self.matches.reduced) return;
      const distance = self.matches.mobile ? 18 : 46;
      document
        .querySelectorAll<HTMLElement>(".portfolio-followup .project-card")
        .forEach((card) => {
          animate(card.querySelector("img")!, {
            y: [distance, -distance],
            scale: [1.04, 1],
            ease: "linear",
            autoplay: onScroll({
              target: card,
              enter: "bottom top",
              leave: "top bottom",
              sync: true,
            }),
          });
          animate(card.querySelector(".project-caption")!, {
            y: [34, 0],
            opacity: [0.25, 1],
            ease: "linear",
            autoplay: onScroll({
              target: card,
              enter: "bottom top",
              leave: "center center",
              sync: true,
            }),
          });
        });
      animate(".studio-drawing > img", {
        y: [distance, -distance],
        ease: "linear",
        autoplay: onScroll({
          target: ".studio-image",
          enter: "bottom top",
          leave: "top bottom",
          sync: true,
        }),
      });
      animate(".contact-form-wrap", {
        y: [self.matches.mobile ? 24 : 70, 0],
        ease: "linear",
        autoplay: onScroll({
          target: ".contact-section",
          enter: "bottom top",
          leave: "center top",
          sync: true,
        }),
      });
    });
    const entrance =
      !reduced.matches && window.scrollY < 20
        ? animate(".atelier-hero-heading h1, .hero-aside", {
            opacity: [0, 1],
            y: [22, 0],
            duration: 650,
            ease: "out(4)",
          })
        : null;
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    update();
    return () => {
      observer.disconnect();
      scope.revert();
      if (entrance) entrance.revert();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <>
      <div className="reading-progress" ref={progress} aria-hidden="true" />
      <a
        href="#main-content"
        className="atelier-compass"
        aria-label="Wróć na górę strony"
      >
        <span>{section}</span>
        <ArrowUp size={17} />
      </a>
    </>
  );
}
