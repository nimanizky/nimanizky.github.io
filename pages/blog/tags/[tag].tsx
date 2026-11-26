import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import BlogNav from '../../../components/blog-nav';
import BlogPostList from '../../../components/blog-post-list';
import type { BlogPostSummary } from '../../../lib/blog';
import { getAllBlogTagGroups, getPostsForTag, normalizeTag } from '../../../lib/blog';

interface BlogTagDetailPageProps {
  tag: string;
  posts: BlogPostSummary[];
}

const BlogTagDetailPage = ({ tag, posts }: BlogTagDetailPageProps) => {
  return (
    <>
      <Head>
        <title>{`${tag} | Blog Tags`}</title>
        <meta name="description" content={`Posts tagged with ${tag}`} />
      </Head>

      <div className="new-portfolio">
        <BlogNav current="tags" detail />
        <main>
          <header className="new-article-heading">
            <h1>#{tag}</h1>
            <p>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
          </header>
          <BlogPostList posts={posts} />
        </main>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllBlogTagGroups().map((group) => ({
    params: {
      tag: group.tagPath,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogTagDetailPageProps> = async ({ params }) => {
  const rawTag = typeof params?.tag === 'string' ? params.tag : '';
  const tagPath = normalizeTag(rawTag);
  const groups = getAllBlogTagGroups();
  const group = groups.find((entry) => entry.tagPath === tagPath);

  if (!group) {
    return {
      notFound: true,
    };
  }

  const posts = getPostsForTag(tagPath);

  return {
    props: {
      tag: group.tag,
      posts,
    },
  };
};

export default BlogTagDetailPage;
