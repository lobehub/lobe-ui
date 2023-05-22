import { DraggablePanel } from '@lobehub/ui';
import { NavLink } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo, type FC } from 'react';

import { useSiteStore } from '@/store/useSiteStore';
import { useStyles } from './style';

const Sidebar: FC = () => {
  const sidebar = useSiteStore((s) => s.sidebar, isEqual);
  const { styles } = useStyles();

  const isEmptySideBar = !sidebar || sidebar.length === 0;

  return isEmptySideBar ? null : (
    <DraggablePanel placement="left" className={styles.sidebar}>
      <div className={styles.sidebarInner}>
        {sidebar.map((item, i) => (
          <dl key={String(i)}>
            {item.title && <dt>{item.title}</dt>}
            {item.children.map((child) => (
              <dd key={child.link}>
                <NavLink to={child.link} title={child.title} end>
                  {child.title}
                </NavLink>
              </dd>
            ))}
          </dl>
        ))}
      </div>
    </DraggablePanel>
  );
};

export default memo(Sidebar);
