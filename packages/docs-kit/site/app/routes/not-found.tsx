import { ArrowLeft } from 'lucide-react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { styles } from './notFoundStyle';

export const meta: MetaFunction = () => [
  { title: `Documentation not found - ${siteConfig.title}` },
  { content: 'noindex, nofollow', name: 'robots' },
];

export default function NotFound() {
  return (
    <main className={styles.root} id="docs-content">
      <p className={styles.code}>404</p>
      <h1>Documentation not found</h1>
      <p>The requested documentation page does not exist.</p>
      <Link className={styles.link} to="/">
        <ArrowLeft aria-hidden size={15} strokeWidth={1.8} />
        Return to the documentation home page
      </Link>
    </main>
  );
}
