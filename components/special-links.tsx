import Link from 'next/link';

interface SpecialLink {
  href: string;
  label: string;
}

export default function SpecialLinks({ links }: { links: SpecialLink[] }) {
  if (links.length === 0) return null;

  return (
    <section className="special-links" aria-label="Special">
      <h2>Special</h2>
      <ul>
        {links.map(({ href, label }) => (
          <li key={href}><Link href={href}>{label}</Link></li>
        ))}
      </ul>
    </section>
  );
}
