import Image from "next/image";
import { ScrollShowroom } from "@/components/scroll-showroom";
import Link from "next/link";
import { ArrowUpRight, Plus, Star } from "lucide-react";
import { ProjectGrid } from "@/components/project-grid";
import { ContactSection } from "@/components/contact-section";
import { AtelierMotion } from "@/components/atelier-motion";
import {
  getAllProjects,
  getFeaturedProjects,
  getHomeHero,
} from "@/lib/cms/reader";
import { processSteps, site } from "@/lib/site-content";
import { pageCopy } from "@/lib/page-content";
import { TextLines } from "@/components/text-lines";
import { canonicalUrl } from "@/lib/deployment";
import { projectCard } from "@/lib/projects";

export const metadata = { alternates: { canonical: canonicalUrl("/") } };
const principles = [
  [
    "Relacja z miejscem",
    "Projekt wyrasta z otoczenia. Światło, krajobraz i kontekst są jego początkiem.",
  ],
  [
    "Uczciwość materiału",
    "Faktura, kolor i detal. Materiały, które tworzą atmosferę i dobrze się starzeją.",
  ],
  [
    "Czytelna funkcja",
    "Codzienne rytuały przekładamy na przestrzeń, w której wszystko ma swoje miejsce.",
  ],
  [
    "Partnerstwo",
    "Rozmowa i wspólne decyzje. Od pierwszego spotkania do ostatniego detalu.",
  ],
];

export default async function HomePage() {
  const [projects, featuredProjects, studioImage] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
    getHomeHero(),
  ]);
  const featured = featuredProjects[0] || projects[0];
  const secondary = [...featuredProjects, ...projects].filter(
    (project, index, list) =>
      project.slug !== featured?.slug &&
      list.findIndex((item) => item.slug === project.slug) === index,
  );
  return (
    <main id="main-content" className="atelier-home">
      <AtelierMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: site.name,
            url: canonicalUrl("/"),
            description: site.description,
            telephone: site.phone,
            email: site.email,
            address: site.address,
            areaServed: site.serviceArea,
          }).replace(/</g, "\\u003c"),
        }}
      />
      {featured ? (
        <ScrollShowroom project={projectCard(featured)} />
      ) : (
        <section className="section container">
          <h1>
            {pageCopy.intro.headingFirst}
            <br />
            {pageCopy.intro.headingSecond}
          </h1>
          <p className="page-intro">{pageCopy.intro.description}</p>
        </section>
      )}

      <section
        id="manifest"
        className="manifest-section dark-section tone-dark"
        data-section="02 / Podejście"
      >
        <span className="tone-curtain curtain-paper" aria-hidden="true" />
        <div className="container">
          <div className="manifest-layout">
            <div>
              <p className="eyebrow">02 / Sposób myślenia</p>
              <h2>
                Przestrzeń z uważnością
                <br />
                na proporcje, materiał
                <br />i codzienność<span>.</span>
              </h2>
            </div>
            <p>
              Wierzymy, że architektura powinna odpowiadać na prawdziwe życie.
              Na codzienność, która bywa różna i potrzebuje własnego miejsca.
              Dlatego nie zaczynamy od bryły. Zaczynamy od rozmowy.
            </p>
            <p>
              Każda decyzja ma znaczenie: od usytuowania domu, przez rytm
              światła we wnętrzu, po detal, którego dotykasz każdego dnia.
              Łączymy wrażliwość na przestrzeń z konkretnym, technicznym
              warsztatem.
            </p>
          </div>
          <div className="manifest-stats">
            <div>
              <strong>
                <span className="sr-only">10+</span>
                <span
                  data-count-to="10"
                  data-count-suffix="+"
                  aria-hidden="true"
                >
                  10+
                </span>
              </strong>
              <span>lat doświadczenia</span>
            </div>
            <div>
              <strong>
                <span className="sr-only">100%</span>
                <span
                  data-count-to="100"
                  data-count-suffix="%"
                  aria-hidden="true"
                >
                  100%
                </span>
              </strong>
              <span>indywidualnych koncepcji</span>
            </div>
            <div>
              <strong>Nadzór autorski</strong>
              <span>w uzgodnionym zakresie</span>
            </div>
            <div>
              <strong>Łódź & Mazowsze</strong>
              <span>tu projektujemy · i nie tylko</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="portfolio"
        className="section portfolio-section portfolio-followup kinetic-portfolio tone-light"
        data-section="03 / Projekty"
      >
        <span className="tone-curtain curtain-basalt" aria-hidden="true" />
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / {pageCopy.portfolio.eyebrow}</p>
              <h2 id="portfolio-heading" tabIndex={-1}>
                {pageCopy.portfolio.heading}
                <span className="blue-dot">.</span>
              </h2>
            </div>
            <Link href="/projekty" className="text-link">
              {pageCopy.portfolio.allProjectsLink}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          {featured && (
            <article className="featured-project kinetic-featured">
              <Link
                className="featured-project-image"
                href={`/projekty/${featured.slug}`}
                data-magnetic-view
                aria-label={`Poznaj projekt: ${featured.title}`}
              >
                <Image
                  src={featured.cover.src}
                  alt={featured.cover.alt}
                  fill
                  sizes="(min-width:900px) 60vw, 100vw"
                  style={{
                    objectFit: featured.cover.objectFit,
                    objectPosition: featured.cover.objectPosition,
                  }}
                />
                <span className="image-label">Łódź / LAT 51.7592° N</span>
                <span className="image-open">
                  <ArrowUpRight size={24} />
                </span>
                <span className="kinetic-view-cursor" aria-hidden="true">
                  <span className="cursor-disc">
                    Zobacz
                    <ArrowUpRight size={15} />
                  </span>
                </span>
              </Link>
              <div className="featured-project-copy">
                <span className="project-index" aria-hidden="true">
                  01
                </span>
                <p className="eyebrow">
                  {featured.category} / {featured.location}
                </p>
                <h3>{featured.title}</h3>
                <p>{featured.description}</p>
                <dl>
                  <div>
                    <dt>Lokalizacja</dt>
                    <dd>{featured.location}</dd>
                  </div>
                  <div>
                    <dt>Materiał</dt>
                    <dd>Wizualizacje</dd>
                  </div>
                </dl>
                <Link
                  className="solid-link"
                  href={`/projekty/${featured.slug}`}
                >
                  Poznaj projekt
                  <ArrowUpRight size={16} />
                </Link>
                <p className="featured-closing">
                  Od proporcji bryły
                  <br />
                  do ostatniego detalu.
                </p>
              </div>
            </article>
          )}
          <ProjectGrid projects={secondary.map(projectCard)} />
          <div className="portfolio-bottom">
            <span>Różne miejsca. Wspólna wrażliwość.</span>
            <Link className="text-link" href="/projekty">
              Odkryj całe portfolio
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="section atelier-about"
        data-section="04 / Pracownia"
      >
        <div className="container atelier-about-layout">
          <div className="studio-image">
            <span className="studio-stamp">
              Paulina Cywińska
              <br />
              Studio Architektury / Łódź
            </span>
            <div className="studio-drawing">
              <Image
                src={studioImage?.src || "/images/site/hero/src.png"}
                alt={
                  studioImage?.alt ||
                  "Warsztat pracowni — od rysunku do przestrzeni"
                }
                width={studioImage?.width || 2795}
                height={studioImage?.height || 1305}
                sizes="(min-width: 900px) 42vw, 100vw"
                loading="eager"
                style={{
                  objectFit: studioImage?.objectFit,
                  objectPosition: studioImage?.objectPosition,
                }}
              />
              <span className="drawing-cross cross-one" />
              <span className="drawing-cross cross-two" />
              <span className="drawing-note">
                Od pierwszej kreski.
                <br />
                Do Twojej przestrzeni.
              </span>
            </div>
            <div className="image-footnote">
              <span>Paulina Cywińska / Studio Architektury</span>
              <span>Łódź, PL</span>
            </div>
            <p className="studio-quote">
              Uważność na miejsce.
              <br />
              Przestrzeń dla Ciebie.
            </p>
          </div>
          <div className="atelier-about-copy">
            <p className="eyebrow">04 / {pageCopy.about.eyebrow}</p>
            <h2>
              {pageCopy.about.heading}
              <span className="blue-dot">.</span>
            </h2>
            <p className="atelier-about-lead">
              <TextLines text={pageCopy.about.lead} />
            </p>
            {site.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="principle-grid">
              {principles.map(([title, description], i) => (
                <div key={title}>
                  <span
                    className="principle-rule rule-top"
                    aria-hidden="true"
                  />
                  <span
                    className="principle-rule rule-side"
                    aria-hidden="true"
                  />
                  <span className="eyebrow">
                    0{i + 1} / {title}
                  </span>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="wspolpraca"
        className="section atelier-process"
        data-section="05 / Proces"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">05 / {pageCopy.process.eyebrow}</p>
              <h2>
                <TextLines text={pageCopy.process.heading} />
              </h2>
            </div>
            <p className="process-intro">
              <TextLines text={pageCopy.process.description} />
              <br />
              Ty opowiadasz. Wspólnie nadajemy pomysłom kształt.
            </p>
          </div>
          <ol className="atelier-process-list">
            <li className="process-spine" aria-hidden="true">
              <span />
            </li>
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <details open={index === 0}>
                  <summary>
                    <span className="step-number">0{index + 1}</span>
                    <h3>{step.title}</h3>
                    <span className="process-preview">{step.description}</span>
                    <Plus size={19} />
                  </summary>
                  <p>{step.description}</p>
                </details>
              </li>
            ))}
          </ol>
          <div className="reviews-inner atelier-reviews">
            <p>
              <Star className="review-star" size={18} aria-hidden="true" />
              {pageCopy.reviews.description}
            </p>
            <a
              className="text-link"
              href={site.maps}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pageCopy.reviews.link}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
