import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import ContactLinks from '../components/contact-links';
import ProjectList from '../components/project-list';
import { getPortfolio, type Portfolio } from '../lib/portfolio';
import { portfolioMenu } from '../lib/portfolio-menu';

export default function OldLook({ experiences, projects, stacks, about, hero }: Portfolio) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="classic-portfolio">
      <Head>
        <title>Old look | Nurrizky Imani</title>
        <meta name="description" content={hero.p1} />
      </Head>

      <div className="classic-shell">
        <div className="classic-layout">
          <button
            type="button"
            className="classic-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="portfolio-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close menu' : 'Menu'}
          </button>
          <nav
            id="portfolio-navigation"
            className="classic-menu"
            aria-label="Portfolio navigation"
            data-open={menuOpen}
          >
            <ul>
              {portfolioMenu.map(({ link, icon, label }) => (
                <li key={link}>
                  <Link href={link} onClick={() => setMenuOpen(false)}>
                    <span aria-hidden="true">{icon}</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <main className="classic-content">
            <section id="home" className="classic-hero">
              <h1 className="font-title-theme type-display font-bold">{hero.strong}</h1>
              <div className="classic-intro">
                <img className="classic-portrait" src={hero.photo_url} alt="Nurrizky Imani" />
                <div className="type-body reading-width">
                  <p>{hero.p1}</p>
                  <p>{hero.p2}</p>
                </div>
              </div>
              <a className="classic-cta" href="#experience">{hero.cta}</a>
            </section>

            <section id="experience" className="classic-section">
              <h2 className="classic-section-title font-title-theme type-section-title">Experience 🧳</h2>
              <ol className="classic-timeline">
                {experiences.map((experience) => (
                  <li key={experience.id} className="classic-work">
                    {experience.emg_photo_url && (
                      <img className="classic-work-logo" src={`/${experience.emg_photo_url}`} alt="" />
                    )}
                    <div className="classic-work-heading">
                      <div>
                        <h3 className="font-title-theme type-card-title">{experience.title}</h3>
                        <p className="type-meta">{experience.company}</p>
                      </div>
                      <p className="classic-work-date type-meta">{experience.date}</p>
                    </div>
                    <ul className="type-body list-disc pl-5">
                      {experience.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>

            <section id="project" className="classic-section">
              <h2 className="classic-section-title font-title-theme type-section-title">Portfolio 📂</h2>
              <ProjectList projects={projects} />
            </section>

            <section id="stack" className="classic-section">
              <h2 className="classic-section-title font-title-theme type-section-title">Stack 🛠</h2>
              <div className="classic-stacks">
                {stacks.map((stack) => (
                  <div key={stack.title}>
                    <h3 className="font-title-theme type-card-title">{stack.title}</h3>
                    <ul className="type-body">
                      {stack.perlevel_stack.map((skill) => <li key={skill}>{skill}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="about" className="classic-section">
              <h2 className="classic-section-title font-title-theme type-section-title">About 👨‍🚀</h2>
              <div className="classic-about">
                <div className="reading-width">
                  <p className="font-title-theme type-meta">{about.greeting}</p>
                  <h3 className="font-title-theme type-section-title font-bold">{about.h1_title}</h3>
                  <p className="font-title-theme type-card-title">{about.h2_subtitle}</p>
                  {about.p_tag.map((paragraph, index) => (
                    <p key={index} className="type-body mt-5">{paragraph}</p>
                  ))}
                </div>
                <div className="classic-contact">
                  <img className="classic-portrait" src={hero.photo_url} alt="" />
                  <h3 className="font-title-theme type-card-title">{about.contact_title}</h3>
                  <p className="type-meta">{about.contact_hint}</p>
                  <ContactLinks contacts={about.contacts} />
                  <Link href="/" className="classic-view-link">Back to home</Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Portfolio> = async () => ({
  props: getPortfolio(),
});
