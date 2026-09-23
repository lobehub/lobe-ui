import { Link } from 'react-router';

import {
  categoryOverviewPathname,
  hasSubgroups,
  type OverviewMatch,
} from '../../content/sectionOverview';
import type { DocumentManifestEntry, NavigationCategory } from '../../types/content';
import { styles } from './style';

const countLabel = (count: number) => `${count} ${count === 1 ? 'page' : 'pages'}`;

function DocumentGrid({ documents }: { documents: readonly DocumentManifestEntry[] }) {
  return (
    <ul className={styles.grid}>
      {documents.map((document) => (
        <li key={document.pathname}>
          <Link className={styles.card} to={document.pathname}>
            <span className={styles.cardTitle}>{document.title}</span>
            {document.description ? (
              <span className={styles.cardDescription}>{document.description}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SectionOverview({ category, section }: OverviewMatch) {
  const categories: NavigationCategory[] = category
    ? [category]
    : section.categories.filter((entry) => entry.documents.length > 0);
  const total = categories.reduce((sum, entry) => sum + entry.documents.length, 0);
  const title = category?.title ?? section.title;
  const showCategoryHeadings = !category && hasSubgroups(section);

  return (
    <div className={styles.root} id="docs-content">
      <header className={styles.header}>
        <h1>{title}</h1>
        <p>
          {category ? `${section.title} · ` : ''}
          {countLabel(total)}
        </p>
      </header>
      {showCategoryHeadings ? (
        categories.map((entry) => {
          const headingId = `overview-${categoryOverviewPathname(section, entry).split('/').pop()}`;
          return (
            <section aria-labelledby={headingId} className={styles.group} key={entry.title}>
              <h2 className={styles.groupTitle} id={headingId}>
                <Link to={categoryOverviewPathname(section, entry)}>{entry.title}</Link>
                <span className={styles.count}>{entry.documents.length}</span>
              </h2>
              <DocumentGrid documents={entry.documents} />
            </section>
          );
        })
      ) : (
        <DocumentGrid documents={categories.flatMap((entry) => entry.documents)} />
      )}
    </div>
  );
}
