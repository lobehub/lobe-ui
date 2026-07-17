import { ArrowLeft, Search } from 'lucide-react';
import type { MetaFunction } from 'react-router';
import { Link, useLocation, useOutletContext } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { styles } from '../../styles/notFoundStyle';
import { contentManifest } from '../content/registry';
import { findSimilarDocuments } from '../content/similarDocuments';
import type { DocsOutletContext } from './docs-layout';

export const meta: MetaFunction = () => [
  { title: `Documentation not found - ${siteConfig.title}` },
  { content: 'noindex, nofollow', name: 'robots' },
];

export default function NotFound() {
  const location = useLocation();
  const { openSearch } = useOutletContext<DocsOutletContext>();
  const suggestions = findSimilarDocuments(location.pathname, contentManifest.documents);

  return (
    <main className={styles.root} id="docs-content">
      <p className={styles.code}>404</p>
      <h1>Documentation not found</h1>
      <p>
        The requested page <code className={styles.path}>{location.pathname}</code> does not exist.
        It may have been moved or renamed.
      </p>
      {suggestions.length > 0 ? (
        <nav aria-label="Similar pages" className={styles.suggestions}>
          <p className={styles.suggestionsTitle}>You may be looking for</p>
          <ul>
            {suggestions.map((document) => (
              <li key={document.pathname}>
                <Link to={document.pathname}>{document.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <div className={styles.actions}>
        <button
          className={styles.searchButton}
          type="button"
          onClick={(event) => openSearch(event.currentTarget)}
        >
          <Search aria-hidden size={15} strokeWidth={1.8} />
          Search documentation
        </button>
        <Link className={styles.link} to="/">
          <ArrowLeft aria-hidden size={15} strokeWidth={1.8} />
          Return to the documentation home page
        </Link>
      </div>
    </main>
  );
}
