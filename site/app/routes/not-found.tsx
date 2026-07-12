import './not-found.css';

import { ArrowLeft } from 'lucide-react';
import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';

export const meta: MetaFunction = () => [
  { title: 'Documentation not found - Lobe UI' },
  { content: 'noindex, nofollow', name: 'robots' },
];

export default function NotFound() {
  return (
    <main className="not-found" id="docs-content">
      <p className="not-found__code">404</p>
      <h1>Documentation not found</h1>
      <p>The requested documentation page does not exist.</p>
      <Link className="not-found__link" to="/">
        <ArrowLeft aria-hidden size={15} strokeWidth={1.8} />
        Return to the documentation home page
      </Link>
    </main>
  );
}
