"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X, Maximize2 } from "lucide-react";
import type { ProjectImage } from "@/lib/projects";
export function ProjectGallery({
  images,
  title,
}: {
  images: ProjectImage[];
  title: string;
}) {
  const [active, setActive] = useState(0),
    [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const change = (direction: number) =>
    setActive((index) => (index + direction + images.length) % images.length);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="project-gallery">
        {images.map((image, index) => (
          <button
            className="gallery-image"
            key={image.src}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setActive(index);
              setOpen(true);
            }}
            aria-label={`Powiększ zdjęcie ${index + 1}: ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1440px) 840px, (min-width: 900px) 62vw, calc(100vw - 48px)"
              priority={index === 0}
            />
            <span className="zoom-icon">
              <Maximize2 size={18} />
            </span>
          </button>
        ))}
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-overlay" />
        <Dialog.Content
          className="lightbox"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              change(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              change(-1);
            }
          }}
        >
          <Dialog.Title className="sr-only">{title} — galeria</Dialog.Title>
          <Dialog.Description className="sr-only">
            Strzałki zmieniają zdjęcie. Escape zamyka powiększenie.
          </Dialog.Description>
          <Dialog.Close asChild>
            <button
              className="lightbox-close"
              aria-label="Zamknij powiększenie"
            >
              <X />
            </button>
          </Dialog.Close>
          <div className="lightbox-photo">
            <Image
              src={images[active].src}
              alt={images[active].alt}
              fill
              sizes="95vw"
            />
          </div>
          <div className="lightbox-controls">
            <button onClick={() => change(-1)} aria-label="Poprzednie zdjęcie">
              <ArrowLeft />
            </button>
            <p aria-live="polite">
              {active + 1} / {images.length}
            </p>
            <button onClick={() => change(1)} aria-label="Następne zdjęcie">
              <ArrowRight />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
