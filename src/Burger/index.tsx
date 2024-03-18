'use client';

import { Drawer, Menu, MenuProps } from 'antd';
import { MenuIcon, X } from 'lucide-react';
import { CSSProperties, memo } from 'react';
import { Center } from 'react-layout-kit';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';

import { useStyles } from './style';

export interface BurgerProps {
  className?: string;
  /**
   * @description The height of the header component
   * @default 64
   */
  headerHeight?: number;
  icon?: ActionIconProps;
  /**
   * @description The items to be displayed in the menu
   */
  items: MenuProps['items'];
  onClick?: MenuProps['onClick'];
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
  style?: CSSProperties;
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
    onClick,
    icon = {},
    ...rest
  }) => {
    const { cx, styles } = useStyles(headerHeight);

    return (
      <Center
        className={cx(styles.container, className)}
        onClick={() => {
          setOpened(!opened);
        }}
        {...rest}
      >
        <ActionIcon icon={opened ? X : MenuIcon} size="site" {...icon} />
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
            onClick={onClick}
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
