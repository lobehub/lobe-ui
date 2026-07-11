import './Sidebar.css';

import { NavLink } from 'react-router';

import type { NavigationSection } from '../../types/content';

interface SidebarProps {
  navigation: NavigationSection[];
  onNavigate?: () => void;
}

const overviewLinks = [
  { pathname: '/', title: 'Overview' },
  { pathname: '/changelog', title: 'Changelog' },
] as const;

export default function Sidebar({ navigation, onNavigate }: SidebarProps) {
  return (
    <nav aria-label="Component documentation" className="docs-sidebar">
      <section className="docs-sidebar__section">
        <h2>Documentation</h2>
        <ul>
          {overviewLinks.map((item) => (
            <li key={item.pathname}>
              <NavLink end={item.pathname === '/'} to={item.pathname} onClick={onNavigate}>
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </section>

      {navigation.map((section) => (
        <section className="docs-sidebar__section" key={section.title}>
          <h2>{section.title}</h2>
          {section.categories.map((category) => (
            <div className="docs-sidebar__category" key={category.title}>
              <h3>{category.title}</h3>
              <ul>
                {category.documents.map((item) => (
                  <li key={item.pathname}>
                    <NavLink end to={item.pathname} onClick={onNavigate}>
                      {item.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </nav>
  );
}
