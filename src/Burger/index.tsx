import { Drawer, Menu, MenuProps } from 'antd';
import { MenuIcon, X } from 'lucide-react';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface BurgerProps extends DivProps {
  headerHeight?: number;
  items: MenuProps['items'];
  openKeys?: MenuProps['openKeys'];
  opened: boolean;
  selectedKeys?: MenuProps['selectedKeys'];
  setOpened: (state: boolean) => void;
}

const Burger = memo<BurgerProps>(
  ({
    items,
    openKeys,
    selectedKeys,
    opened,
    setOpened,
    className,
    headerHeight = 64,
    ...props
  }) => {
    const { cx, styles } = useStyles(headerHeight);

    return (
      <Center
        className={cx(styles.container, className)}
        onClick={() => {
          setOpened(!opened);
        }}
        {...props}
      >
        <ActionIcon icon={opened ? X : MenuIcon} size="site" />
        <Drawer
          bodyStyle={{ padding: 0 }}
          className={styles.drawer}
          closeIcon={undefined}
          headerStyle={{ display: 'none' }}
          open={opened}
          placement={'left'}
          rootClassName={styles.drawerRoot}
          width={'100vw'}
        >
          <Menu
            className={styles.menu}
            items={items}
            mode={'inline'}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
          />
          <div className={styles.fillRect} />
        </Drawer>
      </Center>
    );
  },
);

export default Burger;
