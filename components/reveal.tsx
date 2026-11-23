"use client";
import { useEffect } from "react";

/**
 * Spokojne pojawianie się treści: raz, tylko poniżej pierwszego ekranu,
 * wyłączone przy prefers-reduced-motion. Bez JS treść jest zawsze widoczna.
 */
export function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = [
      ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ];
    const below = elements.filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight * 0.9,
    );
    if (!below.length || !("IntersectionObserver" in window)) return;
    below.forEach((el) => el.setAttribute("data-reveal", "pending"));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reveal", "shown");
          observer.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    below.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      below.forEach((el) => el.setAttribute("data-reveal", "shown"));
    };
  }, []);
  return null;
}
