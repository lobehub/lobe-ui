import { BurgerProps, Burger as Menu } from '@lobehub/ui';
import { Link } from 'dumi';
import isEqual from 'fast-deep-equal';
import { uniq } from 'lodash-es';
import { memo, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { activePathSel, useSiteStore } from '@/store';

const Burger = memo(() => {
  const [opened, setOpened] = useState(false);

  const nav = useSiteStore((s) => s.navData, isEqual);
  const sidebar = useSiteStore((s) => s.sidebar, isEqual);
  const { pathname, activePath } = useSiteStore(
    (s) => ({
      activePath: activePathSel(s),
      pathname: s.location.pathname,
    }),
    shallow,
  );

  const items: BurgerProps['items'] = useMemo(() => {
    const sidebarItems = sidebar?.map((group) => {
      return (
        !group.link && {
          children: group.children.map((item) => ({
            key: `s-${item.link}`,
            label: (
              <Link
                onClick={() => {
                  setOpened(false);
                }}
                to={item.link}
              >
                {item.title}
              </Link>
            ),
          })),
          label: group.title,
          type: 'group',
        }
      );
    });
    return nav.map<any>((item) => {
      return {
        children: (item.activePath || item.link) === activePath && sidebarItems,
        key: item.activePath! || item.link,
        label: <Link to={String(item.link)}>{item.title}</Link>,
      };
    });
  }, [nav, activePath, sidebar]);

  return (
    <Menu
      items={items}
      openKeys={[activePath]}
      opened={opened}
      selectedKeys={uniq([activePath, `s-${pathname}`])}
      setOpened={setOpened}
    />
  );
});

export default Burger;
