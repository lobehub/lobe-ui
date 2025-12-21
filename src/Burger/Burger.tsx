'use client';

import { Drawer, Menu } from 'antd';
import { MenuIcon, X } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Center } from '@/Flex';

import { useStyles } from './style';
import type { BurgerProps } from './type';

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
