import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import BlogNav from '../../../components/blog-nav';
import BlogPostList from '../../../components/blog-post-list';
import type { BlogTagGroup } from '../../../lib/blog';
import { getAllBlogTagGroups } from '../../../lib/blog';

interface BlogTagsPageProps {
  groups: BlogTagGroup[];
}

const BlogTagsPage = ({ groups }: BlogTagsPageProps) => {
  return (
    <>
      <Head>
        <title>Tags | Blog</title>
        <meta name="description" content="Browse blog posts by tag" />
      </Head>

      <div className="new-portfolio">
        <BlogNav current="tags" />
        <main>
          <header className="new-article-heading">
            <h1>Tags</h1>
          </header>

          <nav aria-label="Browse tags">
            <ul className="blog-tag-links">
              {groups.map((group) => (
                <li key={group.tagPath}>
                  <Link href={`/blog/tags/${group.tagPath}/`}>{group.tag}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="blog-tag-groups">
            {groups.map((group) => (
              <section key={group.tagPath} className="new-section">
                <h2><Link href={`/blog/tags/${group.tagPath}/`}>#{group.tag}</Link></h2>
                <BlogPostList posts={group.posts} compact />
              </section>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogTagsPageProps> = async () => {
  const groups = getAllBlogTagGroups();

  return {
    props: {
      groups,
    },
  };
};

export default BlogTagsPage;
