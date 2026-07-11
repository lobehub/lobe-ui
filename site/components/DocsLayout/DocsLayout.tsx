import './DocsLayout.css';

import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

import type { DocumentManifestEntry, NavigationSection } from '../../types/content';

interface DocsLayoutProps {
  children: ReactNode;
  document: DocumentManifestEntry;
  navigation: NavigationSection[];
}

export default function DocsLayout({ children, document, navigation }: DocsLayoutProps) {
  return (
    <main className="docs-layout">
      {navigation.length > 0 ? (
        <aside className="docs-layout__sidebar">
          <nav aria-label="Component documentation">
            {navigation.map((section) => (
              <section className="docs-layout__navigation-section" key={section.title}>
                <h2>{section.title}</h2>
                <ul>
                  {section.documents.map((item) => (
                    <li key={item.pathname}>
                      <NavLink end to={item.pathname}>
                        {item.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </aside>
      ) : null}

      <article data-pagefind-body className="docs-layout__document">
        <header className="docs-layout__header">
          <h1>{document.title}</h1>
          <p>{document.description}</p>
        </header>
        <div className="docs-layout__content">{children}</div>
      </article>
    </main>
  );
}
