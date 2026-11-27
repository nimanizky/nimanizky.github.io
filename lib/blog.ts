import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getSpecialEntries } from './special-content';

const BLOG_POSTS_DIR = path.join(process.cwd(), 'pages/markdown/blog');
const BLOG_FILENAME_REGEX = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const KASAK_KUSUK_DIR = path.join(BLOG_POSTS_DIR, 'Kasak-Kusuk-Markdown');

export interface BlogPost {
  path: string;
  sourceUrl: string | null;
  permalink: string | null;
  href: string;
  pinned: boolean;
  pinnedLabel: string;
  title: string;
  date: string;
  tags: string[];
  normalizedTags: string[];
  excerpt: string;
  content: string;
  legacySlug: string | null;
  imported: boolean;
  coverImage: string | null;
  coverImageAlt: string | null;
  dateValue: number;
}

export interface BlogPostSummary {
  path: string;
  sourceUrl: string | null;
  permalink: string | null;
  href: string;
  pinned: boolean;
  pinnedLabel: string;
  title: string;
  date: string;
  tags: string[];
  normalizedTags: string[];
  excerpt: string;
  coverImage: string | null;
  coverImageAlt: string | null;
}

export interface BlogTagGroup {
  tag: string;
  tagPath: string;
  posts: BlogPostSummary[];
}

interface BlogFrontmatter {
  title?: unknown;
  source_url?: unknown;
  legacy_slug?: unknown;
  status?: unknown;
  labels?: unknown;
  permalink?: unknown;
  pinned?: unknown;
  pinned_label?: unknown;
  date?: unknown;
  tags?: unknown;
  excerpt?: unknown;
  cover_image?: unknown;
  cover_image_alt?: unknown;
}

function validateFilename(fileName: string): void {
  if (!BLOG_FILENAME_REGEX.test(fileName)) {
    throw new Error(
      `Invalid blog filename \"${fileName}\". Use YYYY-MM-DD-title-kebab.md`
    );
  }
}

function asRequiredString(value: unknown, field: string, fileName: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required frontmatter \"${field}\" in ${fileName}`);
  }

  return value.trim();
}

function parseDate(rawDate: unknown, fileName: string): { isoDate: string; dateMs: number } {
  if (!rawDate) {
    throw new Error(`Missing required frontmatter \"date\" in ${fileName}`);
  }

  if (rawDate instanceof Date) {
    const dateMs = rawDate.getTime();

    if (Number.isNaN(dateMs)) {
      throw new Error(`Invalid date value in ${fileName}`);
    }

    return {
      isoDate: rawDate.toISOString().slice(0, 10),
      dateMs,
    };
  }

  if (typeof rawDate === 'string') {
    const trimmed = rawDate.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      throw new Error(
        `Invalid date \"${rawDate}\" in ${fileName}. Expected format: YYYY-MM-DD`
      );
    }

    const parsedDate = new Date(`${trimmed}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date \"${rawDate}\" in ${fileName}`);
    }

    return {
      isoDate: trimmed,
      dateMs: parsedDate.getTime(),
    };
  }

  throw new Error(`Invalid date value in ${fileName}. Use YYYY-MM-DD.`);
}

export function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseTags(rawTags: unknown, fileName: string): { tags: string[]; normalizedTags: string[] } {
  if (!Array.isArray(rawTags) || rawTags.length === 0) {
    throw new Error(`Missing required frontmatter \"tags\" in ${fileName}`);
  }

  const seen = new Set<string>();
  const tags: string[] = [];
  const normalizedTags: string[] = [];

  rawTags.forEach((tagValue, index) => {
    if (typeof tagValue !== 'string' || tagValue.trim().length === 0) {
      throw new Error(`Invalid tag at index ${index} in ${fileName}. Tags must be non-empty strings.`);
    }

    const cleanedTag = tagValue.trim();
    const normalizedTag = normalizeTag(cleanedTag);

    if (!normalizedTag) {
      throw new Error(`Invalid tag \"${cleanedTag}\" in ${fileName}.`);
    }

    if (!seen.has(normalizedTag)) {
      seen.add(normalizedTag);
      tags.push(cleanedTag);
      normalizedTags.push(normalizedTag);
    }
  });

  if (normalizedTags.length === 0) {
    throw new Error(`At least one valid tag is required in ${fileName}`);
  }

  return { tags, normalizedTags };
}

function getPostFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));
}

function toSummary(post: BlogPost): BlogPostSummary {
  return {
    path: post.path,
    sourceUrl: post.sourceUrl,
    permalink: post.permalink,
    href: post.href,
    pinned: post.pinned,
    pinnedLabel: post.pinnedLabel,
    title: post.title,
    date: post.date,
    tags: post.tags,
    normalizedTags: post.normalizedTags,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
  };
}

function isPublished(status: unknown, imported = false): boolean {
  return (status === undefined && !imported)
    || (typeof status === 'string' && status.trim().toLowerCase() === 'published');
}

function parsePost(fileName: string, directory: string, imported = false): BlogPost | null {
  validateFilename(fileName);

  const { data, content } = matter(fs.readFileSync(path.join(directory, fileName), 'utf8'));
  return isPublished(data.status, imported) ? parseArticle(fileName, data, content, imported) : null;
}

function parseArticle(fileName: string, frontmatter: BlogFrontmatter, content: string, imported = false): BlogPost {
  const title = typeof frontmatter.title === 'string' ? frontmatter.title.trim() : '';
  const { isoDate, dateMs } = parseDate(frontmatter.date, fileName);
  const rawTags = imported ? frontmatter.labels : frontmatter.tags;
  const { tags, normalizedTags } = rawTags === undefined || (Array.isArray(rawTags) && rawTags.length === 0)
    ? { tags: [], normalizedTags: [] }
    : parseTags(rawTags, fileName);

  // Blogger exports repeat the title as the first Markdown heading.
  const body = imported ? content.trim()
    .replace(/^# [^\n]*\n+/, '')
    .replace(/<img\b[^>]*\bsrc="(assets\/[a-f0-9]+\.jpg|https?:\/\/[^"\s]+)"[^>]*>/gi, (_, source: string) => {
      const url = source.startsWith('assets/')
        ? `/blog/kasak-kusuk/${source.slice('assets/'.length)}`
        : source.replace(/^http:/i, 'https:');
      return `\n\n![Archive image](<${url}>)\n\n`;
    }) : content.trim();
  const excerpt = imported
    ? body.split(/\n\s*\n/).find((paragraph) => !paragraph.trimStart().startsWith('<'))
        ?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 220) ?? ''
    : asRequiredString(frontmatter.excerpt, 'excerpt', fileName);
  const sourceUrl = typeof frontmatter.source_url === 'string' && /^https?:\/\//i.test(frontmatter.source_url.trim())
    ? frontmatter.source_url.trim() : null;

  const coverImage =
    typeof frontmatter.cover_image === 'string' && frontmatter.cover_image.trim().length > 0
      ? frontmatter.cover_image.trim()
      : null;

  const coverImageAlt =
    typeof frontmatter.cover_image_alt === 'string' && frontmatter.cover_image_alt.trim().length > 0
      ? frontmatter.cover_image_alt.trim()
      : null;

  const slug = fileName.replace(/\.md$/, '');
  const permalink = frontmatter.permalink ?? null;
  if (permalink !== null && (typeof permalink !== 'string' || !/^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(permalink))) {
    throw new Error(`Invalid permalink in ${fileName}. Use a single root slug such as /bookshelf/.`);
  }
  if (frontmatter.pinned !== undefined && typeof frontmatter.pinned !== 'boolean') {
    throw new Error(`Invalid pinned value in ${fileName}. Use true or false.`);
  }

  return {
    path: slug,
    sourceUrl,
    legacySlug: typeof frontmatter.legacy_slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.legacy_slug)
      ? frontmatter.legacy_slug : null,
    imported,
    permalink,
    href: permalink ?? `/blog/${slug}/`,
    pinned: frontmatter.pinned === true,
    pinnedLabel: frontmatter.pinned_label === undefined ? title || isoDate : asRequiredString(frontmatter.pinned_label, 'pinned_label', fileName),
    title,
    date: isoDate,
    tags,
    normalizedTags,
    excerpt,
    content: body,
    coverImage,
    coverImageAlt,
    dateValue: dateMs,
  };
}

function sortByNewest(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => {
    if (b.dateValue !== a.dateValue) {
      return b.dateValue - a.dateValue;
    }

    return a.path.localeCompare(b.path);
  });
}

export function validatePermalinks(routes: string[]) {
  const permalinks = new Set(['/404/', '/500/', '/api/', '/blog/', '/index/']);
  for (const permalink of routes) {
    const slug = permalink.slice(1, -1);
    const collides = ['.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts', '/index.jsx', '/index.js']
      .some((extension) => fs.existsSync(path.join(process.cwd(), 'pages', slug + extension)));
    if (permalinks.has(permalink) || collides || fs.existsSync(path.join(process.cwd(), 'public', slug))) {
      throw new Error(`Unavailable blog permalink ${permalink}`);
    }
    permalinks.add(permalink);
  }
}

export function getAllBlogPosts(): BlogPost[] {
  const posts = [
    ...getPostFiles(BLOG_POSTS_DIR).map((file) => parsePost(file, BLOG_POSTS_DIR)),
    ...getPostFiles(KASAK_KUSUK_DIR).map((file) => parsePost(file, KASAK_KUSUK_DIR, true)),
  ].filter((post): post is BlogPost => post !== null);
  for (const entry of getSpecialEntries()) {
    if (entry.layout === 'article' && isPublished(entry.data.status)) {
      posts.push(parseArticle(entry.file, entry.data, entry.content));
    }
  }

  validatePermalinks(posts.flatMap(({ permalink }) => permalink ? [permalink] : []));
  const slugs = new Set<string>();
  for (const { path, legacySlug, permalink } of posts) {
    if (permalink) continue;
    for (const slug of legacySlug ? [path, legacySlug] : [path]) {
      if (slugs.has(slug)) throw new Error(`Duplicate blog slug ${slug}`);
      slugs.add(slug);
    }
  }
  return sortByNewest(posts);
}

export function getAllBlogPostSummaries(): BlogPostSummary[] {
  return getAllBlogPosts().map(toSummary);
}

export function getAllBlogPostPaths(): string[] {
  return getAllBlogPosts().filter((post) => !post.permalink)
    .flatMap(({ path, legacySlug }) => legacySlug ? [path, legacySlug] : [path]);
}

export function getBlogPostByPath(postPath: string): BlogPost | null {
  const posts = getAllBlogPosts();
  const foundPost = posts.find((post) => post.path === postPath || post.legacySlug === postPath);

  return foundPost ?? null;
}

export function getAllBlogTagGroups(): BlogTagGroup[] {
  const posts = getAllBlogPostSummaries();
  const tagMap = new Map<string, BlogTagGroup>();

  posts.forEach((post) => {
    post.normalizedTags.forEach((normalizedTag, index) => {
      const existingGroup = tagMap.get(normalizedTag);
      const displayTag = post.tags[index] ?? normalizedTag;

      if (existingGroup) {
        existingGroup.posts.push(post);
        return;
      }

      tagMap.set(normalizedTag, {
        tag: displayTag,
        tagPath: normalizedTag,
        posts: [post],
      });
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getPostsForTag(tagPath: string): BlogPostSummary[] {
  const normalizedTag = normalizeTag(tagPath);

  return getAllBlogPostSummaries().filter((post) => post.normalizedTags.includes(normalizedTag));
}
