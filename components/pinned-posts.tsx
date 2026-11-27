import Link from 'next/link';

interface PinnedPost {
  href: string;
  pinnedLabel: string;
}

export default function PinnedPosts({ posts }: { posts: PinnedPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="pinned-posts" aria-label="Pinned posts">
      <h2>Pinned</h2>
      <ul>
        {posts.map(({ href, pinnedLabel }) => (
          <li key={href}>
            <Link href={href}>{pinnedLabel}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
