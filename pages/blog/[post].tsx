import { GetStaticPaths, GetStaticProps } from 'next';
import BlogArticle, { type BlogPostProps } from '../../components/blog-article';
import { getAllBlogPostPaths, getBlogPostByPath } from '../../lib/blog';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllBlogPostPaths().map((postPath) => ({
    params: {
      post: postPath,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  const postPath = typeof params?.post === 'string' ? params.post : '';
  const post = getBlogPostByPath(postPath);

  if (!post || post.permalink) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};

export default BlogArticle;
