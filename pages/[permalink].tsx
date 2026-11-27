import type { GetStaticPaths, GetStaticProps } from 'next';
import BlogArticle, { type BlogPostProps } from '../components/blog-article';
import { getAllBlogPosts } from '../lib/blog';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getAllBlogPosts().flatMap(({ permalink }) =>
    permalink ? [{ params: { permalink: permalink.slice(1, -1) } }] : []
  ),
  fallback: false,
});

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  if (typeof params?.permalink !== 'string') return { notFound: true };

  const href = `/${params.permalink}/`;
  const post = getAllBlogPosts().find(({ permalink }) => permalink === href);
  return post ? { props: { post } } : { notFound: true };
};

export default BlogArticle;
