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
          <ul>
            {section.documents.map((item) => (
              <li key={item.pathname}>
                <NavLink end to={item.pathname} onClick={onNavigate}>
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
