import { Drawer, Menu } from 'antd';
import { Link } from 'dumi';
import isEqual from 'fast-deep-equal';
import { uniq } from 'lodash';
import { memo, useState } from 'react';
import { Center } from 'react-layout-kit';

import { activePathSel, useSiteStore } from '@/store';

import { useStyles } from './style';

const Burger = memo(() => {
  const [opened, setOpened] = useState(false);
  const { styles, cx } = useStyles();

  const nav = useSiteStore((s) => s.navData, isEqual);
  const sidebar = useSiteStore((s) => s.sidebar, isEqual);
  const activePath = useSiteStore(activePathSel);
  const pathname = useSiteStore((s) => s.location.pathname);

  return (
    <Center
      className={styles.container}
      onClick={() => {
        setOpened(!opened);
      }}
    >
      <div className={cx(styles.icon, opened ? styles.active : '')} />

      <Drawer
        bodyStyle={{ padding: 0 }}
        className={styles.drawer}
        closeIcon={null}
        headerStyle={{ display: 'none' }}
        open={opened}
        placement={'left'}
        rootClassName={styles.drawerRoot}
        width={'100vw'}
      >
        <Menu
          className={styles.menu}
          items={nav.map<any>((item) => ({
            label: <Link to={String(item.link)}>{item.title}</Link>,
            key: item.activePath! || item.link,
            children:
              (item.activePath || item.link) === activePath &&
              sidebar?.map((group) => {
                return (
                  !group.link && {
                    label: group.title,
                    type: 'group',
                    children: group.children.map((item) => ({
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
                      key: `s-${item.link}`,
                    })),
                  }
                );
              }),
          }))}
          mode={'inline'}
          openKeys={[activePath]}
          selectedKeys={uniq([activePath, `s-${pathname}`])}
        />
        <div className={styles.fillRect} />
      </Drawer>
    </Center>
  );
});

export default Burger;
