import Link from 'next/link';

interface BlogNavProps {
  current: 'blog' | 'tags';
  detail?: boolean;
}

export default function BlogNav({ current, detail = false }: BlogNavProps) {
  const active = detail ? 'location' : 'page';

  return (
    <header className="new-header">
      <Link href="/" className="blog-brand">Nurrizky Imani</Link>
      <nav aria-label="Blog navigation">
        <ul className="new-section-links">
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/blog/" aria-current={current === 'blog' ? active : undefined}>Blog</Link></li>
          <li><Link href="/blog/tags/" aria-current={current === 'tags' ? active : undefined}>Tags</Link></li>
        </ul>
      </nav>
    </header>
  );
}
