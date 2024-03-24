'use client';

import { Drawer, type DrawerProps, Menu, type MenuProps } from 'antd';
import { MenuIcon, X } from 'lucide-react';
import { CSSProperties, memo } from 'react';
import { Center } from 'react-layout-kit';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';

import { useStyles } from './style';

export interface BurgerProps {
  className?: string;
  drawerProps?: Partial<Omit<DrawerProps, 'items' | 'opened' | 'setOpened'>>;
  fullscreen?: boolean;
  /**
   * @description The height of the header component
   * @default 64
   */
  headerHeight?: number;
  iconProps?: Partial<ActionIconProps>;
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
  rootClassName?: string;
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
    iconProps,
    rootClassName,
    fullscreen,
    drawerProps,
    ...rest
  }) => {
    const { cx, styles } = useStyles({ fullscreen, headerHeight });

    return (
      <Center
        className={cx(styles.container, className)}
        onClick={() => {
          setOpened(!opened);
        }}
        {...rest}
      >
        <ActionIcon icon={opened ? X : MenuIcon} size="site" {...iconProps} />
        <Drawer
          closeIcon={undefined}
          open={opened}
          placement={'left'}
          width={'100vw'}
          {...drawerProps}
          className={styles.drawer}
          rootClassName={cx(styles.drawerRoot, rootClassName)}
          styles={{
            body: { padding: 0 },
            header: { display: 'none' },
          }}
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
