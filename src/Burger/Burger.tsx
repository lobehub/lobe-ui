'use client';

import { Drawer, Menu } from 'antd';
import { cx } from 'antd-style';
import { MenuIcon, X } from 'lucide-react';
import { memo, useMemo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Center } from '@/Flex';

import { styles } from './style';
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
    // Convert props to CSS variables
    const cssVariables = useMemo<Record<string, string>>(() => {
      const vars: Record<string, string> = {
        '--burger-header-height': `${headerHeight}px`,
      };
      if (fullscreen) {
        vars['--burger-drawer-top'] = '0';
        vars['--burger-menu-padding-top'] = '0px';
      } else {
        vars['--burger-drawer-top'] = `calc(var(--burger-header-height, ${headerHeight}px) + 1px)`;
        vars['--burger-menu-padding-top'] = `${headerHeight}px`;
      }
      return vars;
    }, [fullscreen, headerHeight]);

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
          rootClassName={cx(
            fullscreen ? styles.drawerRootFullscreen : styles.drawerRoot,
            rootClassName,
          )}
          rootStyle={{
            ...cssVariables,
            ...drawerProps?.rootStyle,
          }}
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
            style={cssVariables}
          />
          <div className={styles.fillRect} />
        </Drawer>
      </Center>
    );
  },
);

Burger.displayName = 'Burger';

export default Burger;
