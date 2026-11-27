import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import BlogArticle from '../components/blog-article';
import BlogNav from '../components/blog-nav';
import type { BlogPost } from '../lib/blog';
import { getPortfolio } from '../lib/portfolio';
import { getPermalinkEntries } from '../lib/special';

type PermalinkProps =
  | { kind: 'post'; post: BlogPost }
  | { kind: 'profile'; label: string; content: string; photo: string };

export const getStaticPaths: GetStaticPaths = async () => {
  const { profiles, posts } = getPermalinkEntries();
  const routes = [...profiles.map((profile) => profile.permalink), ...posts.map((post) => post.href)];

  return { paths: routes.map((href) => ({ params: { permalink: href.slice(1, -1) } })), fallback: false };
};

export const getStaticProps: GetStaticProps<PermalinkProps> = async ({ params }) => {
  if (typeof params?.permalink !== 'string') return { notFound: true };

  const href = `/${params.permalink}/`;
  const { profiles, posts } = getPermalinkEntries();
  const profile = profiles.find(({ permalink }) => permalink === href);
  if (profile) {
    return {
      props: {
        kind: 'profile',
        label: profile.label,
        content: profile.content,
        photo: getPortfolio().hero.photo_url,
      },
    };
  }

  const post = posts.find((post) => post.href === href);
  return post ? { props: { kind: 'post', post } } : { notFound: true };
};

export default function PermalinkPage(props: PermalinkProps) {
  if (props.kind === 'post') return <BlogArticle post={props.post} />;

  return (
    <div className="new-portfolio">
      <Head><title>{`${props.label} | Nurrizky Imani`}</title></Head>
      <BlogNav />
      <main className="profile-page" aria-label={props.label}>
        <img className="profile-photo" src={props.photo} alt="Nurrizky Imani" width={132} height={132} />
        <div className="blog-content">
          <ReactMarkdown>{props.content}</ReactMarkdown>
        </div>
      </main>
    </div>
  );
}
