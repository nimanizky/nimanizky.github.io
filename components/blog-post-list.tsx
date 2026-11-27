import Link from 'next/link';
import type { BlogPostSummary } from '../lib/blog';
import { formatBlogDate } from '../lib/blog-client';

export default function BlogPostList({ posts, compact = false }: { posts: BlogPostSummary[]; compact?: boolean }) {
  return (
    <ul className={compact ? 'blog-post-links' : 'blog-post-list'}>
      {posts.map((post) => (
        <li key={post.path}>
          {compact ? (
            <Link href={post.href}>{post.title}</Link>
          ) : (
            <h2><Link href={post.href}>{post.title}</Link></h2>
          )}
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          {!compact && <p>{post.excerpt}</p>}
        </li>
      ))}
    </ul>
  );
}
