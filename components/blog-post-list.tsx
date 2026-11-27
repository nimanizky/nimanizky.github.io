import Link from 'next/link';
import type { BlogPostSummary } from '../lib/blog';
import { formatBlogDate } from '../lib/blog-client';

export default function BlogPostList({ posts, compact = false }: { posts: BlogPostSummary[]; compact?: boolean }) {
  return (
    <ul className={compact ? 'blog-post-links' : 'blog-post-list'}>
      {posts.map((post) => (
        <li key={post.path}>
          {post.title && (compact
            ? <Link href={post.href}>{post.title}</Link>
            : <h2><Link href={post.href}>{post.title}</Link></h2>)}
          <span>
            <time dateTime={post.date}>
              {post.title ? formatBlogDate(post.date) : <Link href={post.href}>{formatBlogDate(post.date)}</Link>}
            </time>
            {post.draft && <span className="blog-draft">Draft</span>}
          </span>
          {!compact && post.excerpt && <p>{post.excerpt}</p>}
        </li>
      ))}
    </ul>
  );
}
