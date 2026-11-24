import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactSection } from "@/components/contact-section";
import { Reveal } from "@/components/reveal";
import {
  getAllProjects,
  getFeaturedProjects,
  getHomeHero,
} from "@/lib/cms/reader";
import { processSteps, site } from "@/lib/site-content";
import { pageCopy } from "@/lib/page-content";
import { TextLines } from "@/components/text-lines";
import { canonicalUrl } from "@/lib/deployment";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/") },
  openGraph: { url: canonicalUrl("/") },
};
export default async function HomePage() {
  const [projects, featuredProjects, studioImage] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
    getHomeHero(),
  ]);
  const ordered = [...featuredProjects, ...projects].filter(
    (project, index, list) =>
      list.findIndex((item) => item.slug === project.slug) === index,
  );
  const featured = ordered[0];
  const houses = ordered
    .filter((p) => p.category === "Domy" && p.slug !== featured?.slug)
    .slice(0, 3);
  const moreCategories = ["Przebudowy", "Przestrzenie publiczne", "Wnętrza"];
  const more = moreCategories
    .map((category) => ordered.find((p) => p.category === category))
    .filter((p): p is (typeof ordered)[number] => Boolean(p));
  return (
    <main id="main-content" className="w-home">
      <Reveal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${canonicalUrl("/")}#website`,
                name: site.title,
                url: canonicalUrl("/"),
                inLanguage: "pl-PL",
                publisher: { "@id": `${canonicalUrl("/")}#studio` },
              },
              {
                "@type": "ProfessionalService",
                "@id": `${canonicalUrl("/")}#studio`,
                name: site.name,
                url: canonicalUrl("/"),
                description: site.description,
                telephone: site.phone,
                email: site.email,
                taxID: site.nip,
                address: {
                  "@type": "PostalAddress",
                  ...site.postalAddress,
                },
                areaServed: site.serviceArea.map((name) => ({
                  "@type": "City",
                  name,
                })),
                hasMap: site.maps,
                ...(featured
                  ? { image: canonicalUrl(featured.cover.src) }
                  : {}),
                founder: {
                  "@type": "Person",
                  name: "Paulina Cywińska",
                  jobTitle: "Architektka",
                  worksFor: { "@id": `${canonicalUrl("/")}#studio` },
                },
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section className="w-hero" aria-labelledby="hero-heading">
        <div className="container w-hero-grid">
          <div className="w-hero-copy">
            <p className="w-eyebrow">{pageCopy.intro.eyebrow}</p>
            <h1 id="hero-heading">
              {pageCopy.intro.headingFirst}
              <br />
              {pageCopy.intro.headingSecond}
            </h1>
            <p className="w-lead">{pageCopy.intro.description}</p>
            <div className="w-actions">
              <Link href="#kontakt" className="w-button">
                Opisz swoją działkę
              </Link>
              <Link href="#portfolio" className="w-link">
                {pageCopy.intro.projectsLink}
              </Link>
            </div>
          </div>
          {featured && (
            <Link
              href={`/projekty/${featured.slug}`}
              className="w-hero-image"
              aria-label={`Zobacz projekt: ${featured.title}`}
            >
              <Image
                src={featured.cover.src}
                alt={featured.cover.alt}
                width={featured.cover.width}
                height={featured.cover.height}
                sizes="(min-width: 1100px) 58vw, 100vw"
                priority
                style={{
                  objectFit: featured.cover.objectFit || "cover",
                  objectPosition: featured.cover.objectPosition,
                }}
              />
              <span className="w-caption">{featured.title}</span>
            </Link>
          )}
        </div>
      </section>

      <section
        id="portfolio"
        className="w-section"
        aria-labelledby="portfolio-heading"
      >
        <div className="container">
          <div className="w-heading">
            <div>
              <p className="w-eyebrow">{pageCopy.portfolio.eyebrow}</p>
              <h2 id="portfolio-heading" tabIndex={-1}>
                {pageCopy.portfolio.heading}
              </h2>
            </div>
            <Link href="/projekty" className="w-link">
              {pageCopy.portfolio.allProjectsLink}
            </Link>
          </div>
          <div className="w-houses">
            {houses.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projekty/${project.slug}`}
                className={"w-house" + (index === 0 ? " w-house-wide" : "")}
                data-reveal
              >
                <span className="w-frame">
                  <Image
                    src={project.cover.src}
                    alt={project.cover.alt}
                    fill
                    sizes={
                      index === 0
                        ? "(min-width: 1100px) 1200px, 100vw"
                        : "(min-width: 900px) 600px, 100vw"
                    }
                    style={{
                      objectFit: project.cover.objectFit || "cover",
                      objectPosition: project.cover.objectPosition,
                    }}
                  />
                </span>
                <span className="w-house-meta">
                  <span className="w-house-title">{project.title}</span>
                  <span className="w-meta">
                    {[project.category, project.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="w-section w-sand" aria-labelledby="more-heading">
          <div className="container">
            <div className="w-heading">
              <div>
                <p className="w-eyebrow">Zakres pracowni</p>
                <h2 id="more-heading">Nie tylko domy</h2>
              </div>
              <p className="w-heading-note">
                Przebudowy z uzgodnieniami konserwatorskimi, przestrzenie
                publiczne i wnętrza. To samo uważne podejście w innej skali.
              </p>
            </div>
            <div className="w-cards">
              {more.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projekty/${project.slug}`}
                  className="w-card"
                  data-reveal
                >
                  <span className="w-frame">
                    <Image
                      src={project.cover.src}
                      alt={project.cover.alt}
                      fill
                      sizes="(min-width: 900px) 400px, 100vw"
                      style={{
                        objectFit: project.cover.objectFit || "cover",
                        objectPosition: project.cover.objectPosition,
                      }}
                    />
                  </span>
                  <span className="w-meta">{project.category}</span>
                  <span className="w-card-title">{project.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="about" className="w-section" aria-labelledby="about-heading">
        <div className="container w-about">
          <div className="w-about-copy" data-reveal>
            <p className="w-eyebrow">{pageCopy.about.eyebrow}</p>
            <h2 id="about-heading">
              <TextLines text={pageCopy.about.lead} />
            </h2>
            {site.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <figure className="w-about-image" data-reveal>
            <Image
              src={studioImage?.src || "/images/site/hero/src.png"}
              alt={
                studioImage?.alt ||
                "Warsztat pracowni — od rysunku do przestrzeni"
              }
              width={studioImage?.width || 2795}
              height={studioImage?.height || 1305}
              sizes="(min-width: 900px) 44vw, 100vw"
              style={{
                objectFit: studioImage?.objectFit,
                objectPosition: studioImage?.objectPosition,
              }}
            />
            <figcaption>Od pierwszej kreski do Twojej przestrzeni.</figcaption>
          </figure>
        </div>
      </section>

      <section
        id="wspolpraca"
        className="w-section w-sand"
        aria-labelledby="process-heading"
      >
        <div className="container">
          <div className="w-heading">
            <div>
              <p className="w-eyebrow">{pageCopy.process.eyebrow}</p>
              <h2 id="process-heading">
                <TextLines text={pageCopy.process.heading} />
              </h2>
            </div>
            <p className="w-heading-note">
              <TextLines text={pageCopy.process.description} />
            </p>
          </div>
          <ol className="w-steps">
            {processSteps.map((step, index) => (
              <li key={step.title} data-reveal>
                <span className="w-step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
