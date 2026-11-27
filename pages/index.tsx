import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import ContactLinks from '../components/contact-links';
import SpecialLinks from '../components/special-links';
import ProjectList from '../components/project-list';
import { getSpecialLinks } from '../lib/special';
import { getAllBlogPostSummaries } from '../lib/blog';
import { getFriends, getPortfolio, type Friend, type Portfolio } from '../lib/portfolio';

interface Update {
  href: string;
  title: string;
  date: string;
}

interface HomeProps extends Portfolio {
  updates: Update[];
  special: ReturnType<typeof getSpecialLinks>;
  friends: Friend[];
}

const INITIAL_UPDATES = 4;
const sections = [
  { id: 'updates', label: 'Updates' },
  { id: 'works', label: 'Works' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
];

function UpdateList({ updates }: { updates: Update[] }) {
  return (
    <ul className="new-updates">
      {updates.map(({ href, title, date }) => (
        <li key={href}>
          <time dateTime={date}>{date.slice(5, 7)}/{date.slice(0, 4)}</time>
          <Link href={href}>{title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home({ experiences, projects, stacks, about, hero, updates, friends, special }: HomeProps) {
  return (
    <div className="new-portfolio">
      <Head>
        <title>Nurrizky Imani</title>
        <meta name="description" content={hero.p1} />
      </Head>

      <header className="new-header">
        <h1>Nurrizky Imani</h1>
        <nav aria-label="Sections">
          <ul className="new-section-links">
            <li><Link href="/">Home</Link></li>
            {sections.map(({ id, label }) => (
              <li key={id}><a href={`#${id}`}>{label}</a></li>
            ))}
            <li><Link href="/blog/">Blogs</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="new-section" id="about" aria-label="About">
          <div className="new-about">
            <div className="new-bio">
              <p>{hero.p1}</p>
              <p>{hero.p2}</p>
              {about.p_tag.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <div className="new-contact">
              <img src={hero.photo_url} alt="Nurrizky Imani" width={144} height={144} />
              <p className="new-contact-hint">{about.contact_hint}</p>
              <ContactLinks contacts={about.contacts} />
              <SpecialLinks links={special} />
            </div>
          </div>
        </section>

        <section className="new-section" id="updates" aria-labelledby="new-updates-title">
          <h2 id="new-updates-title">Updates</h2>
          <UpdateList updates={updates.slice(0, INITIAL_UPDATES)} />
          {updates.length > INITIAL_UPDATES && (
            <details className="new-more-updates">
              <summary>
                <span className="show-more">Show more</span>
                <span className="show-less">Show less</span>
              </summary>
              <UpdateList updates={updates.slice(INITIAL_UPDATES)} />
            </details>
          )}
        </section>

        <section className="new-section" id="works" aria-labelledby="new-works-title">
          <h2 id="new-works-title">Works</h2>
          <ol className="new-work-list">
            {experiences.map((experience) => (
              <li key={experience.id} className="new-work">
                <div className="new-work-heading">
                  <h3>{experience.company}</h3>
                  <p className="new-work-date">{experience.date}</p>
                </div>
                <p>{experience.title}</p>
                {experience.highlights.length > 0 && (
                  <ul className="new-work-highlights">
                    {experience.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="new-section" id="projects" aria-labelledby="new-projects-title">
          <h2 id="new-projects-title">Projects</h2>
          <ProjectList projects={projects} />
        </section>

        <section className="new-section" id="skills" aria-labelledby="new-skills-title">
          <h2 id="new-skills-title">Skills</h2>
          <dl className="new-skills">
            {stacks.map((stack) => (
              <div key={stack.title}>
                <dt>{stack.title}</dt>
                <dd>{stack.perlevel_stack.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="new-section" id="friends" aria-labelledby="friends-title">
          <h2 id="friends-title">Friends of Internet</h2>
          <ul className="friends-grid">
            {friends.map(({ name, url, domain }) => (
              <li key={url}>
                <a href={url}>{name}</a>
                <span>{domain}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="new-footer">
        <Link href="/old-look/">Old look</Link>
      </footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const posts = getAllBlogPostSummaries();
  return {
    props: {
      ...getPortfolio(),
      friends: getFriends(),
      updates: posts.map(({ href, title, date }) => ({ href, title, date })),
      special: getSpecialLinks(posts),
    },
  };
};
