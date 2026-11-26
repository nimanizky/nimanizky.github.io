import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import BlogNav from '../../components/blog-nav';
import BlogPostList from '../../components/blog-post-list';
import type { BlogPostSummary } from '../../lib/blog';
import { getAllBlogPostSummaries } from '../../lib/blog';

interface BlogIndexProps {
  posts: BlogPostSummary[];
}

const INITIAL_VISIBLE_POSTS = 5;
const POSTS_PER_BATCH = 5;

const BlogIndexPage = ({ posts }: BlogIndexProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_POSTS);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const hasMorePosts = visibleCount < posts.length;
  const visiblePosts = useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount]);

  useEffect(() => {
    if (!hasMorePosts || !loadMoreRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((currentCount) => Math.min(currentCount + POSTS_PER_BATCH, posts.length));
          }
        });
      },
      {
        rootMargin: '140px 0px',
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMorePosts, posts.length]);

  return (
    <>
      <Head>
        <title>Blog | Nurrizky Imani</title>
        <meta name="description" content="Markdown blog posts by Nurrizky Imani" />
      </Head>

      <div className="new-portfolio">
        <BlogNav current="blog" />
        <main>
          <header className="new-article-heading">
            <h1>Blog</h1>
          </header>
          {visiblePosts.length === 0 && <p>No posts yet.</p>}
          <BlogPostList posts={visiblePosts} />
          {hasMorePosts && <div ref={loadMoreRef} className="h-px" />}
        </main>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const posts = getAllBlogPostSummaries();

  return {
    props: {
      posts,
    },
  };
};

export default BlogIndexPage;
