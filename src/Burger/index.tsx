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
  headerHeight?: number;
  iconProps?: Partial<ActionIconProps>;
  items: MenuProps['items'];
  onClick?: MenuProps['onClick'];
  openKeys?: MenuProps['openKeys'];
  opened: boolean;
  rootClassName?: string;
  selectedKeys?: MenuProps['selectedKeys'];
  setOpened: (state: boolean) => void;
  size?: ActionIconProps['size'];
  style?: CSSProperties;
  variant?: ActionIconProps['variant'];
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
    size,
    variant,
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
        <ActionIcon icon={opened ? X : MenuIcon} size={size} variant={variant} {...iconProps} />
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

Burger.displayName = 'Burger';

export default Burger;
