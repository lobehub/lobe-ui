import { NavLink } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo } from 'react';

import { useSiteStore } from '@/store/useSiteStore';

import { useStyles } from './style';

const Sidebar = memo(() => {
  const sidebar = useSiteStore((s) => s.sidebar, isEqual);
  const { styles } = useStyles();
  const isEmptySideBar = !sidebar || sidebar.length === 0;

  return isEmptySideBar ? undefined : (
    <section className={styles.sidebarInner}>
      {sidebar.map((item, index) => (
        <dl key={String(index)}>
          {item.title && <dt>{item.title}</dt>}
          {item.children.map((child) => (
            <dd key={child.link}>
              <NavLink end title={child.title} to={child.link}>
                {child.title}
              </NavLink>
            </dd>
          ))}
        </dl>
      ))}
    </section>
  );
});

export default Sidebar;
