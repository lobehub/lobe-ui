import './Sidebar.css';

import { NavLink } from 'react-router';

import type { NavigationCategory, NavigationSection } from '../../types/content';

interface SidebarProps {
  navigation: NavigationSection[];
  onNavigate?: () => void;
  section?: NavigationSection;
}

const overviewLinks = [
  { pathname: '/', title: 'Overview' },
  { pathname: '/changelog', title: 'Changelog' },
] as const;

const CategoryGroup = ({
  category,
  onNavigate,
}: {
  category: NavigationCategory;
  onNavigate?: () => void;
}) => (
  <div className="docs-sidebar__category">
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
);

export default function Sidebar({ navigation, onNavigate, section }: SidebarProps) {
  if (section) {
    return (
      <nav aria-label="Component documentation" className="docs-sidebar">
        <section aria-label={section.title} className="docs-sidebar__section">
          {section.categories.map((category) => (
            <CategoryGroup category={category} key={category.title} onNavigate={onNavigate} />
          ))}
        </section>
      </nav>
    );
  }

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

      {navigation.map((navigationSection) => (
        <section className="docs-sidebar__section" key={navigationSection.title}>
          <h2>{navigationSection.title}</h2>
          {navigationSection.categories.map((category) => (
            <CategoryGroup category={category} key={category.title} onNavigate={onNavigate} />
          ))}
        </section>
      ))}
    </nav>
  );
}
