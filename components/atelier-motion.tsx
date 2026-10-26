"use client";
import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { animate, cubicBezier, stagger, spring } from "animejs";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
export function AtelierMotion() {
  const progress = useRef<HTMLDivElement>(null);
  const compass = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".atelier-home");
    if (!root) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 767px)");
    const ease = cubicBezier(0.16, 1, 0.3, 1);
    let dispose = () => {};
    const setup = () => {
      dispose();
      const staticMode = reduced.matches;
      const desktop = !staticMode && !mobile.matches;
      root.dataset.kinetic = staticMode
        ? "static"
        : desktop
          ? "desktop"
          : "mobile";
      const animations: ReturnType<typeof animate>[] = [];
      const observers: IntersectionObserver[] = [];
      const cleanups: (() => void)[] = [];
      const run = (
        target: Parameters<typeof animate>[0],
        options: Parameters<typeof animate>[1],
      ) => {
        const animation = animate(target, options);
        animations.push(animation);
        return animation;
      };
      const reveal = (
        selector: string,
        callback: (el: HTMLElement, index: number) => void,
        threshold = 0.12,
      ) => {
        const elements = [...root.querySelectorAll<HTMLElement>(selector)];
        const observer = new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                callback(
                  entry.target as HTMLElement,
                  elements.indexOf(entry.target as HTMLElement),
                );
                observer.unobserve(entry.target);
              }
            }),
          { threshold },
        );
        elements.forEach((el) => observer.observe(el));
        observers.push(observer);
      };
      if (!staticMode) {
        if (scrollY < 20) {
          run(".hero-line", {
            y: ["105%", "0%"],
            opacity: [0, 1],
            duration: 700,
            delay: stagger(100),
            ease,
          });
          run(".hero-metadata", {
            y: [12, 0],
            opacity: [0, 1],
            delay: 300,
            duration: 650,
            ease,
          });
        }
        reveal(".tone-curtain", (el) =>
          run(el, { scaleY: [1, 0], duration: desktop ? 1000 : 600, ease }),
        );
        reveal(".manifest-layout", (el) =>
          run(el.children, {
            y: [24, 0],
            opacity: [0, 1],
            duration: 650,
            delay: stagger(120),
            ease,
          }),
        );
        reveal(".project-card", (el, index) => {
          run(el.querySelector(".project-curtain")!, {
            scaleY: [1, 0],
            duration: desktop ? 1000 : 600,
            delay: (index % 3) * 100,
            ease,
          });
          run(el.querySelector(".project-caption")!, {
            y: [24, 0],
            opacity: [0, 1],
            duration: 650,
            delay: (index % 3) * 100,
            ease,
          });
        });
        reveal(
          ".manifest-section",
          (el) => {
            el.querySelectorAll<HTMLElement>("[data-count-to]").forEach(
              (counter) => {
                const value = { count: 0 };
                run(value, {
                  count: Number(counter.dataset.countTo),
                  duration: 1200,
                  ease,
                  onUpdate: () => {
                    counter.textContent = `${Math.round(value.count)}${counter.dataset.countSuffix || ""}`;
                  },
                });
              },
            );
          },
          0.4,
        );
        reveal(".principle-grid", (el) => {
          run(el.querySelectorAll(".rule-top"), {
            scaleX: [0, 1],
            duration: 650,
            delay: stagger(100),
            ease,
          });
          run(el.querySelectorAll(".rule-side"), {
            scaleY: [0, 1],
            duration: 650,
            delay: stagger(100),
            ease,
          });
        });
        reveal(".atelier-reviews", (el) => {
          run(el, { y: [24, 0], opacity: [0, 1], duration: 650, ease });
          const star = el.querySelector(".review-star");
          if (star) run(star, { scale: [1, 1.25, 1], duration: 700, ease });
        });
        reveal(".contact-form-wrap", (el) =>
          run(el, {
            y: [desktop ? 70 : 24, 0],
            opacity: [0, 1],
            duration: 1000,
            ease,
          }),
        );
      }
      const sections = [
        ...document.querySelectorAll<HTMLElement>("[data-section]"),
      ];
      const dark = [
        ...document.querySelectorAll<HTMLElement>(
          ".dark-section, .site-footer",
        ),
      ];
      const phases = [
        ...root.querySelectorAll<HTMLElement>(
          ".atelier-process-list > li:not(.process-spine)",
        ),
      ];
      const spine = root.querySelector<HTMLElement>(".process-spine > span");
      const list = root.querySelector<HTMLElement>(".atelier-process-list");
      const hero = root.querySelector<HTMLElement>(".kinetic-hero-frame");
      const heroImage = hero?.querySelector("img");
      const tag = hero?.querySelector<HTMLElement>(".hero-technical-tag");
      const masks = [...root.querySelectorAll<HTMLElement>(".hero-line-mask")];
      const photos = [
        ...root.querySelectorAll<HTMLImageElement>(
          ".project-cover img, .featured-project-image > img, .studio-drawing > img",
        ),
      ];
      let ranges: { el: HTMLElement; top: number; bottom: number }[] = [];
      let darkRanges: { top: number; bottom: number }[] = [];
      let photoRanges: { el: HTMLImageElement; top: number; height: number }[] =
        [];
      let centers: number[] = [];
      let listTop = 0,
        listHeight = 1,
        frame = 0;
      let idle: ReturnType<typeof setTimeout>,
        settle: ReturnType<typeof setTimeout>;
      const measure = () => {
        const bounds = (el: HTMLElement) => {
          const rect = el.getBoundingClientRect();
          return { el, top: rect.top + scrollY, bottom: rect.bottom + scrollY };
        };
        ranges = sections.map(bounds);
        darkRanges = dark.map(bounds);
        centers = phases.map((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top + scrollY + rect.height / 2;
        });
        if (list) {
          const rect = list.getBoundingClientRect();
          listTop = rect.top + scrollY;
          listHeight = rect.height;
        }
        photoRanges = photos.map((el) => {
          const rect = el.parentElement!.getBoundingClientRect();
          return { el, top: rect.top + scrollY, height: rect.height };
        });
        schedule();
      };
      const update = () => {
        frame = 0;
        const y = scrollY,
          height = innerHeight;
        if (progress.current)
          progress.current.style.transform = `scaleX(${clamp(y / Math.max(1, document.documentElement.scrollHeight - height))})`;
        header?.classList.toggle("nav--scrolled", y >= 60);
        header?.classList.toggle(
          "nav--dark",
          y >= 60 &&
            darkRanges.some((r) => y + 32 >= r.top && y + 32 < r.bottom),
        );
        const current =
          ranges.find(
            (r) => y + height * 0.35 >= r.top && y + height * 0.35 < r.bottom,
          ) || ranges[0];
        const label = compass.current?.querySelector(".compass-section");
        if (
          label &&
          current &&
          label.textContent !== current.el.dataset.section
        )
          label.textContent = current.el.dataset.section || "";
        if (spine)
          spine.style.transform = `scaleY(${staticMode ? 1 : clamp((y + height * 0.5 - listTop) / listHeight)})`;
        const nearest = centers.reduce(
          (best, center, i) =>
            Math.abs(center - y - height / 2) <
            Math.abs(centers[best] - y - height / 2)
              ? i
              : best,
          0,
        );
        phases.forEach((el, i) => {
          el.dataset.active = String(staticMode || i === nearest);
        });
        if (desktop) {
          const fraction = clamp(y / 800);
          if (hero) hero.style.transform = `scale(${1 + fraction * 0.04})`;
          if (heroImage)
            heroImage.style.transform = `translateY(${-fraction * 5}%) scale(1.12)`;
          if (tag) tag.style.transform = `translateY(${-fraction * 4}px)`;
          masks.forEach((el, i) => {
            el.style.transform = `translate(${fraction * i * 7}px, ${fraction * -i * 5}px)`;
          });
          photoRanges.forEach(({ el, top, height: photoHeight }) => {
            const position = clamp((y + height - top) / (height + photoHeight));
            el.style.transform = `translateY(${(position - 0.5) * -64}px) scale(1.05)`;
          });
        }
      };
      function schedule() {
        if (!frame) frame = requestAnimationFrame(update);
      }
      const activity = () => {
        root.dataset.scrolling = "true";
        clearTimeout(settle);
        settle = setTimeout(() => {
          root.dataset.scrolling = "false";
        }, 160);
        if (compass.current) compass.current.dataset.idle = "false";
        clearTimeout(idle);
        if (mobile.matches && !staticMode)
          idle = setTimeout(() => {
            if (compass.current) compass.current.dataset.idle = "true";
          }, 2400);
        schedule();
      };
      if (desktop && matchMedia("(pointer: fine)").matches) {
        root
          .querySelectorAll<HTMLElement>("[data-magnetic-view]")
          .forEach((link) => {
            const cursor = link.querySelector<HTMLElement>(
              ".kinetic-view-cursor",
            )!;
            const enter = () => {
              link.classList.add("cursor-ready");
              run(cursor, { opacity: 1, scale: [0.8, 1], duration: 220, ease });
            };
            const move = (event: PointerEvent) => {
              const rect = link.getBoundingClientRect();
              cursor.style.left = `${event.clientX - rect.left - 42}px`;
              cursor.style.top = `${event.clientY - rect.top - 42}px`;
            };
            const leave = () => {
              run(cursor, { opacity: 0, duration: 180, ease });
            };
            link.addEventListener("pointerenter", enter);
            link.addEventListener("pointermove", move);
            link.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              link.removeEventListener("pointerenter", enter);
              link.removeEventListener("pointermove", move);
              link.removeEventListener("pointerleave", leave);
              link.classList.remove("cursor-ready");
            });
          });
      }
      if (!staticMode) {
        root
          .querySelectorAll<HTMLElement>(".contact-submit")
          .forEach((button) => {
            const arrow = button.querySelector("svg");
            if (!arrow) return;
            const enter = () => {
              run(arrow, { x: 4, duration: 200, ease });
            };
            const leave = () => {
              run(arrow, {
                x: 0,
                ease: spring({ bounce: 0.2, duration: 400 }),
              });
            };
            button.addEventListener("pointerenter", enter);
            button.addEventListener("pointerleave", leave);
            button.addEventListener("focus", enter);
            button.addEventListener("blur", leave);
            cleanups.push(() => {
              button.removeEventListener("pointerenter", enter);
              button.removeEventListener("pointerleave", leave);
              button.removeEventListener("focus", enter);
              button.removeEventListener("blur", leave);
            });
          });
      }
      const resize = new ResizeObserver(measure);
      resize.observe(root);
      window.addEventListener("scroll", activity, { passive: true });
      window.addEventListener("resize", measure);
      window.addEventListener("pointerdown", activity, { passive: true });
      measure();
      activity();
      dispose = () => {
        observers.forEach((observer) => observer.disconnect());
        resize.disconnect();
        animations.reverse().forEach((animation) => animation.revert());
        root.querySelectorAll<HTMLElement>("[data-count-to]").forEach((el) => {
          el.textContent = `${el.dataset.countTo}${el.dataset.countSuffix || ""}`;
        });
        cleanups.forEach((cleanup) => cleanup());
        window.removeEventListener("scroll", activity);
        window.removeEventListener("resize", measure);
        window.removeEventListener("pointerdown", activity);
        cancelAnimationFrame(frame);
        clearTimeout(idle);
        clearTimeout(settle);
        [hero, heroImage, tag, spine, ...masks, ...photos].forEach((el) =>
          el?.style.removeProperty("transform"),
        );
        if (compass.current) delete compass.current.dataset.idle;
      };
    };
    setup();
    reduced.addEventListener("change", setup);
    mobile.addEventListener("change", setup);
    return () => {
      dispose();
      reduced.removeEventListener("change", setup);
      mobile.removeEventListener("change", setup);
      header?.classList.remove("nav--dark", "nav--scrolled");
      delete root.dataset.kinetic;
      delete root.dataset.scrolling;
    };
  }, []);
  return (
    <>
      <div className="reading-progress" ref={progress} aria-hidden="true" />
      <a
        href="#main-content"
        ref={compass}
        className="atelier-compass kinetic-compass"
        aria-label="Wróć na górę strony"
      >
        <span className="compass-section">01 / Początek</span>
        <span className="compass-top">
          Góra
          <ArrowUp size={17} />
        </span>
      </a>
    </>
  );
}
