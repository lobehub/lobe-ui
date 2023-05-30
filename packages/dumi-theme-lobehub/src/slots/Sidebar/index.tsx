import { useSiteStore } from '@/store/useSiteStore';
import { DraggablePanel } from '@lobehub/ui';
import { useResponsive } from 'antd-style';
import { NavLink } from 'dumi';
import isEqual from 'fast-deep-equal';
import { memo, useEffect, useState } from 'react';
import { useStyles } from './style';

const Sidebar = memo(() => {
  const [expand, setExpand] = useState(true);
  const sidebar = useSiteStore((s) => s.sidebar, isEqual);
  const { styles } = useStyles();
  const { laptop } = useResponsive();
  const isEmptySideBar = !sidebar || sidebar.length === 0;

  useEffect(() => {
    setExpand(Boolean(laptop));
  }, [laptop]);

  return isEmptySideBar ? null : (
    <DraggablePanel
      placement="left"
      className={styles.sidebar}
      expand={expand}
      onExpandChange={setExpand}
    >
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
});

export default Sidebar;
