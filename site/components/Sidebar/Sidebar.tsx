import { LayoutGroup, motion, MotionConfig } from 'motion/react';
import { useId } from 'react';
import { NavLink } from 'react-router';

import type { NavigationCategory, NavigationSection } from '../../types/content';
import { styles } from './style';

interface SidebarProps {
  navigation: NavigationSection[];
  onNavigate?: () => void;
  section?: NavigationSection;
}

const overviewLinks = [
  { pathname: '/', title: 'Overview' },
  { pathname: '/changelog', title: 'Changelog' },
] as const;

const pillTransition = { damping: 32, stiffness: 380, type: 'spring' } as const;

const SidebarLink = ({
  end,
  onNavigate,
  pathname,
  title,
}: {
  end: boolean;
  onNavigate?: () => void;
  pathname: string;
  title: string;
}) => (
  <NavLink end={end} to={pathname} onClick={onNavigate}>
    {({ isActive }) => (
      <>
        {isActive ? (
          <motion.span
            className={styles.activePill}
            layoutId="docs-sidebar-active"
            transition={pillTransition}
          />
        ) : null}
        <span className={styles.label}>{title}</span>
      </>
    )}
  </NavLink>
);

const CategoryGroup = ({
  category,
  onNavigate,
}: {
  category: NavigationCategory;
  onNavigate?: () => void;
}) => (
  <div className={styles.category}>
    <h3>{category.title}</h3>
    <ul>
      {category.documents.map((item) => (
        <li key={item.pathname}>
          <SidebarLink end pathname={item.pathname} title={item.title} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  </div>
);

export default function Sidebar({ navigation, onNavigate, section }: SidebarProps) {
  const layoutGroupId = useId();

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id={layoutGroupId}>
        {section ? (
          <nav aria-label="Component documentation" className={styles.root}>
            <section aria-label={section.title} className={styles.section}>
              {section.categories.map((category) => (
                <CategoryGroup category={category} key={category.title} onNavigate={onNavigate} />
              ))}
            </section>
          </nav>
        ) : (
          <nav aria-label="Component documentation" className={styles.root}>
            <section className={styles.section}>
              <h2>Documentation</h2>
              <ul>
                {overviewLinks.map((item) => (
                  <li key={item.pathname}>
                    <SidebarLink
                      end={item.pathname === '/'}
                      pathname={item.pathname}
                      title={item.title}
                      onNavigate={onNavigate}
                    />
                  </li>
                ))}
              </ul>
            </section>

            {navigation.map((navigationSection) => (
              <section className={styles.section} key={navigationSection.title}>
                <h2>{navigationSection.title}</h2>
                {navigationSection.categories.map((category) => (
                  <CategoryGroup category={category} key={category.title} onNavigate={onNavigate} />
                ))}
              </section>
            ))}
          </nav>
        )}
      </LayoutGroup>
    </MotionConfig>
  );
}
