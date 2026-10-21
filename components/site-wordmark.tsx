import Image from "next/image";
import { appearance } from "@/lib/appearance";

export function SiteWordmark() {
  const { logo } = appearance;
  return logo.src ? (
    <Image
      className="wordmark-logo"
      src={logo.src}
      alt={logo.alt}
      width={320}
      height={80}
      sizes="(max-width: 480px) 190px, 240px"
    />
  ) : (
    <>
      <span>{logo.title}</span>
      <small>{logo.subtitle}</small>
    </>
  );
}
