import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Experience {
  id: number;
  title: string;
  company: string;
  date: string;
  emg_photo_url: string;
  highlights: string[];
}

export interface Project {
  url_link: string;
  title: string;
  each_explanation: string[];
  tags_project: string[];
}

interface Stack {
  title: string;
  perlevel_stack: string[];
}

export interface Contact {
  icon: string;
  label: string;
  link: string;
}

interface About {
  h1_title: string;
  h2_subtitle: string;
  p_tag: string[];
  greeting: string;
  contact_title: string;
  contact_hint: string;
  contacts: Contact[];
}

interface Hero {
  strong: string;
  photo_url: string;
  p1: string;
  p2: string;
  cta: string;
}

export interface Portfolio {
  experiences: Experience[];
  projects: Project[];
  stacks: Stack[];
  about: About;
  hero: Hero;
}

function readMarkdown(fileName: string) {
  return fs.readFileSync(path.join(process.cwd(), 'pages/markdown', fileName), 'utf8');
}

function readEntries(fileName: string) {
  return readMarkdown(fileName)
    .split('\n---\n')
    .filter((entry) => entry.trim())
    .map((entry) => matter(entry).data);
}

export function getPortfolio(): Portfolio {
  const experiences = readEntries('work.md')
    .map((entry): Experience => ({
      id: Number(entry.id) || 0,
      title: entry.title || '',
      company: entry.company || '',
      date: entry.date || '',
      emg_photo_url: entry.emg_photo_url || '',
      highlights: entry.highlights || [],
    }))
    .sort((first, second) => second.id - first.id);

  const projects = readEntries('project.md').map((entry): Project => ({
    title: entry.title || '',
    url_link: entry.url_link || '',
    each_explanation: entry.each_explanation || [],
    tags_project: (entry.tags_project || []).filter(Boolean),
  }));

  const stacks = readEntries('stack.md').map((entry): Stack => ({
    title: entry.title || '',
    perlevel_stack: (entry.perlevel_stack || []).filter(Boolean),
  }));

  const about = matter(readMarkdown('about.md')).data;
  const hero = matter(readMarkdown('hero.md')).data;

  return {
    experiences,
    projects,
    stacks,
    about: {
      h1_title: about.h1_title || '',
      h2_subtitle: about.h2_subtitle || '',
      p_tag: about.p_tag || [],
      greeting: about.greeting || '',
      contact_title: about.contact_title || '',
      contact_hint: about.contact_hint || '',
      contacts: about.contacts || [],
    },
    hero: {
      strong: hero.strong || '',
      photo_url: hero.photo_url || 'https://avatars3.githubusercontent.com/u/25843889?s=460&u=0665df9620e6db3156619b8414fdd6b047f32286&v=4',
      p1: hero.p1 || '',
      p2: hero.p2 || '',
      cta: hero.cta || '',
    },
  };
}
