import { getAllBlogPosts, validatePermalinks, type BlogPostSummary } from './blog';
import { getSpecialEntries } from './special-content';

export function getSpecialLinks(posts: BlogPostSummary[]) {
  const entries = getSpecialEntries();
  const articleLinks = entries.filter(({ layout }) => layout === 'article');
  const profileLinks = entries.filter(({ layout }) => layout === 'profile');
  const specialHrefs = new Set(entries.map(({ permalink }) => permalink));
  return [
    ...[...articleLinks, ...profileLinks].map(({ permalink, label }) => ({ href: permalink, label })),
    ...posts.filter(({ pinned, href }) => pinned && !specialHrefs.has(href))
      .map(({ href, pinnedLabel }) => ({ href, label: pinnedLabel })),
  ];
}

export function getPermalinkEntries() {
  const profiles = getSpecialEntries().filter(({ layout }) => layout === 'profile');
  const posts = getAllBlogPosts().filter(({ permalink }) => permalink !== null);
  validatePermalinks([...profiles.map((profile) => profile.permalink), ...posts.map((post) => post.href)]);
  return { profiles, posts };
}
