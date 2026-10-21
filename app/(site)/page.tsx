import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectGrid } from "@/components/project-grid";
import { ContactSection } from "@/components/contact-section";
import { getFeaturedProjects, getPrimaryCover } from "@/lib/cms/reader";
import { processSteps, site } from "@/lib/site-content";
export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();
  const hero = featuredProjects[0]?.cover || (await getPrimaryCover());
  return (
    <main id="main-content">
      <div className="hero">
        {hero && (
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            sizes="(min-width: 1440px) 1280px, 100vw"
            priority
          />
        )}
      </div>
      <section className="intro container">
        <p className="eyebrow">Paulina Cywińska · Studio Architektury</p>
        <div className="intro-columns">
          <h1>
            Architektura
            <br className="desktop-break" /> dopasowana do życia.
          </h1>
          <div>
            <p>
              Projekty domów, wnętrz i przestrzeni usługowych. Indywidualne
              podejście do miejsca, funkcji i potrzeb inwestora.
            </p>
            <a className="text-link" href="#portfolio">
              Zobacz projekty <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section id="portfolio" className="section portfolio-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2>Wybrane projekty</h2>
            </div>
            <Link className="text-link" href="/projekty">
              Wszystkie projekty <ArrowUpRight size={18} />
            </Link>
          </div>
          <ProjectGrid projects={featuredProjects} />
        </div>
      </section>
      <section id="about" className="section dark-section">
        <div className="container about-columns">
          <div>
            <p className="eyebrow">O pracowni</p>
            <h2>Paulina Cywińska</h2>
            <p className="about-lead">
              Uważność na miejsce.
              <br />
              Przestrzeń dla Ciebie.
            </p>
          </div>
          <div className="about-copy">
            {site.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>
      <section id="wspolpraca" className="section">
        <div className="container process-columns">
          <div>
            <p className="eyebrow">Współpraca</p>
            <h2>
              Od rozmowy
              <br />
              do przestrzeni.
            </h2>
            <p className="process-intro">
              Przejrzysty proces i wspólne decyzje.
              <br />
              Zakres dopasowany do Twojego projektu.
            </p>
          </div>
          <ol className="process-list">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="reviews-section">
        <div className="container reviews-inner">
          <p>Poznaj doświadczenia osób, które zaufały pracowni.</p>
          <a
            className="text-link"
            href={site.maps}
            target="_blank"
            rel="noopener noreferrer"
          >
            Zobacz opinie w Google <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
