import { Drawer, Menu, MenuProps } from 'antd';
import { MenuIcon, X } from 'lucide-react';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface BurgerProps extends DivProps {
  /**
   * @description The height of the header component
   * @default 64
   */
  headerHeight?: number;
  /**
   * @description The items to be displayed in the menu
   */
  items: MenuProps['items'];
  /**
   * @description The keys of the currently open sub-menus
   */
  openKeys?: MenuProps['openKeys'];
  /**
   * @description Whether the menu is currently open or not
   */
  opened: boolean;
  /**
   * @description The keys of the currently selected menu items
   */
  selectedKeys?: MenuProps['selectedKeys'];
  /**
   * @description A callback function to set the opened state
   */
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
          className={styles.drawer}
          closeIcon={undefined}
          open={opened}
          placement={'left'}
          rootClassName={styles.drawerRoot}
          styles={{
            body: { padding: 0 },
            header: { display: 'none' },
          }}
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
