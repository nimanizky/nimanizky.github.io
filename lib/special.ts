import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllBlogPosts, validatePermalinks, type BlogPostSummary } from './blog';

const profilesDirectory = path.join(process.cwd(), 'pages/markdown/profiles');

export function getProfiles() {
  return fs.readdirSync(profilesDirectory).filter((file) => file.endsWith('.md')).sort().map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(profilesDirectory, file), 'utf8'));
    const { permalink, label } = data;
    if (typeof permalink !== 'string' || !/^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(permalink)
      || typeof label !== 'string' || !label.trim()) {
      throw new Error(`Invalid profile permalink or label in ${file}`);
    }
    return { permalink, label: label.trim(), content: content.trim() };
  });
}

export function getSpecialLinks(posts: BlogPostSummary[]) {
  const profiles = getProfiles();
  validatePermalinks([
    ...profiles.map((profile) => profile.permalink),
    ...posts.flatMap(({ permalink }) => permalink ? [permalink] : []),
  ]);
  return [
    ...posts.filter((post) => post.pinned).map(({ href, pinnedLabel }) => ({ href, label: pinnedLabel })),
    ...profiles.map(({ permalink, label }) => ({ href: permalink, label })),
  ];
}

export function getPermalinkEntries() {
  const profiles = getProfiles();
  const posts = getAllBlogPosts().filter(({ permalink }) => permalink !== null);
  validatePermalinks([...profiles.map((profile) => profile.permalink), ...posts.map((post) => post.href)]);
  return { profiles, posts };
}
