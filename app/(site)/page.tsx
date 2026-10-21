import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProjectGrid } from "@/components/project-grid";
import { ContactSection } from "@/components/contact-section";
import { getFeaturedProjects, getHomeHero } from "@/lib/cms/reader";
import { processSteps, site } from "@/lib/site-content";
import { pageCopy } from "@/lib/page-content";
import { TextLines } from "@/components/text-lines";
import { canonicalUrl } from "@/lib/deployment";
import { projectCard } from "@/lib/projects";
export const metadata = { alternates: { canonical: canonicalUrl("/") } };
export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();
  const hero = await getHomeHero();
  return (
    <main id="main-content">
      <div className="hero">
        {hero && (
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width}
            height={hero.height}
            style={
              hero.objectFit
                ? {
                    objectFit: hero.objectFit,
                    objectPosition: hero.objectPosition,
                  }
                : undefined
            }
            sizes="(min-width: 1440px) 1280px, 100vw"
            priority
          />
        )}
      </div>
      <section className="intro container">
        <p className="eyebrow">{pageCopy.intro.eyebrow}</p>
        <div className="intro-columns">
          <h1>
            {pageCopy.intro.headingFirst}
            <br className="desktop-break" /> {pageCopy.intro.headingSecond}
          </h1>
          <div>
            <p>{pageCopy.intro.description}</p>
            <a className="text-link" href="#portfolio">
              {pageCopy.intro.projectsLink} <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section id="portfolio" className="section portfolio-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{pageCopy.portfolio.eyebrow}</p>
              <h2>{pageCopy.portfolio.heading}</h2>
            </div>
            <Link className="text-link" href="/projekty">
              {pageCopy.portfolio.allProjectsLink} <ArrowUpRight size={18} />
            </Link>
          </div>
          <ProjectGrid projects={featuredProjects.map(projectCard)} />
        </div>
      </section>
      <section id="about" className="section dark-section">
        <div className="container about-columns">
          <div>
            <p className="eyebrow">{pageCopy.about.eyebrow}</p>
            <h2>{pageCopy.about.heading}</h2>
            <p className="about-lead">
              <TextLines text={pageCopy.about.lead} />
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
            <p className="eyebrow">{pageCopy.process.eyebrow}</p>
            <h2>
              <TextLines text={pageCopy.process.heading} />
            </h2>
            <p className="process-intro">
              <TextLines text={pageCopy.process.description} />
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
          <p>{pageCopy.reviews.description}</p>
          <a
            className="text-link"
            href={site.maps}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pageCopy.reviews.link} <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
