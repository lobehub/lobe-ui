import { Burger as Menu } from '@lobehub/ui';
import { Link } from 'dumi';
import isEqual from 'fast-deep-equal';
import { uniq } from 'lodash-es';
import { memo, useState } from 'react';

import { activePathSel, useSiteStore } from '@/store';

const Burger = memo(() => {
  const [opened, setOpened] = useState(false);

  const nav = useSiteStore((s) => s.navData, isEqual);
  const sidebar = useSiteStore((s) => s.sidebar, isEqual);
  const activePath = useSiteStore(activePathSel);
  const pathname = useSiteStore((s) => s.location.pathname);

  return (
    <Menu
      items={nav.map<any>((item) => ({
        children:
          (item.activePath || item.link) === activePath &&
          sidebar?.map((group) => {
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
          }),
        key: item.activePath! || item.link,
        label: <Link to={String(item.link)}>{item.title}</Link>,
      }))}
      openKeys={[activePath]}
      opened={opened}
      selectedKeys={uniq([activePath, `s-${pathname}`])}
      setOpened={setOpened}
    />
  );
});

export default Burger;
