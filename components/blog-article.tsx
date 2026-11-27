import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BlogNav from './blog-nav';
import type { BlogPost } from '../lib/blog';
import { formatBlogDate } from '../lib/blog-client';

export interface BlogPostProps {
  post: BlogPost;
}

export default function BlogArticle({ post }: BlogPostProps) {
  return (
    <>
      <Head>
        <title>{`${post.title || formatBlogDate(post.date)} | Blog`}</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={post.href} />
      </Head>

      <div className="new-portfolio">
        <BlogNav current="blog" detail />

        <main>
          <article className="new-article">
            <header className="new-article-heading">
              {post.title && <h1>{post.title}</h1>}
              <p>
                {!post.draft && 'Published on '}
                <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
                {post.draft && <span className="blog-draft">Draft</span>}
              </p>
            </header>

            {post.coverImage && (
              <img
                className="new-article-cover"
                src={post.coverImage}
                alt={post.coverImageAlt ?? post.title}
              />
            )}

            <div className="blog-content">
              <ReactMarkdown skipHtml={post.imported}>{post.content}</ReactMarkdown>
            </div>

            {post.sourceUrl && <p className="blog-source"><a href={post.sourceUrl}>Source</a></p>}

            {post.tags.length > 0 && (
              <div className="new-article-tags">
                <span><Link href="/blog/tags/">Tags</Link>:</span>
                <ul className="blog-tag-links" aria-label="Article tags">
                  {post.tags.map((tag, index) => (
                    <li key={post.normalizedTags[index]}>
                      <Link href={`/blog/tags/${post.normalizedTags[index]}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </main>
      </div>
    </>
  );
}
