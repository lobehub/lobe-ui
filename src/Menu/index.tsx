'use client';

import {
  Menu as AntdMenu,
  type MenuProps as AntdMenuProps,
  ConfigProvider,
  type MenuRef,
} from 'antd';
import { cva } from 'class-variance-authority';
import { forwardRef, useMemo } from 'react';

import { type IconProps } from '@/Icon';
import { GenericItemType } from '@/Menu/type';

import { useStyles } from './style';
import { mapItems } from './utils';

export interface MenuProps<T = unknown> extends Omit<AntdMenuProps, 'items'> {
  iconProps?: Omit<IconProps, 'icon'>;
  items: GenericItemType<T>[];
  shadow?: boolean;
  variant?: 'filled' | 'outlined' | 'borderless';
}

const Menu = forwardRef<MenuRef, MenuProps>(
  ({ shadow, variant = 'borderless', className, selectable, items, iconProps, ...rest }, ref) => {
    const { cx, styles, theme } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            shadow: false,
            variant: 'borderless',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            shadow: {
              false: null,
              true: styles.shadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const antdItems = useMemo(
      () => items.map((item) => mapItems(item, iconProps)),
      [items, iconProps],
    );

    return (
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              controlHeightLG: 36,
              iconMarginInlineEnd: 8,
              iconSize: 16,
              itemActiveBg: theme.isDarkMode ? theme.colorFillQuaternary : theme.colorFillSecondary,
              itemBorderRadius: theme.borderRadius,
              itemColor: theme.colorTextSecondary,
              itemHoverBg: theme.colorFillTertiary,
              itemMarginBlock: 4,
              itemMarginInline: 4,
              itemSelectedBg: theme.colorFillSecondary,
            },
          },
        }}
      >
        <AntdMenu
          className={cx(variants({ shadow, variant }), className)}
          inlineIndent={12}
          items={antdItems}
          mode="vertical"
          ref={ref}
          selectable={selectable}
          {...rest}
        />
      </ConfigProvider>
    );
  },
);

Menu.displayName = 'Menu';

export type {
  ItemType,
  MenuDividerType,
  MenuInfo,
  MenuItemGroupType,
  MenuItemType,
  SubMenuType,
} from './type';
export { mapItems } from './utils';

export default Menu;
