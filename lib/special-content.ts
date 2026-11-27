import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface SpecialEntry {
  file: string;
  layout: 'article' | 'profile';
  permalink: string;
  label: string;
  content: string;
  data: Record<string, unknown>;
}

export function getSpecialEntries(): SpecialEntry[] {
  const directory = path.join(process.cwd(), 'pages/markdown/specials');

  return fs.readdirSync(directory).filter((file) => file.endsWith('.md')).sort().map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
    const { layout, permalink, label } = data;

    if ((layout !== 'article' && layout !== 'profile')
      || typeof permalink !== 'string' || !/^\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(permalink)
      || typeof label !== 'string' || !label.trim()) {
      throw new Error(`Invalid layout, permalink, or label in special Markdown file ${file}`);
    }

    return { file, layout, permalink, label: label.trim(), content: content.trim(), data };
  });
}
