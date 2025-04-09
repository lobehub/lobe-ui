'use client';

import { Menu as AntdMenu, ConfigProvider } from 'antd';
import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import { IconProvider } from '@/Icon';
import { mapItems } from '@/Menu/utils';

import { useStyles } from './style';
import type { MenuProps } from './type';

const Menu = memo<MenuProps>(
  ({ shadow, variant = 'borderless', className, selectable, iconProps, items, ref, ...rest }) => {
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

    const antdItems = useMemo(() => items.map((item) => mapItems(item)), [items]);

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
        <IconProvider
          config={{
            size: 'small',
            ...iconProps,
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
        </IconProvider>
      </ConfigProvider>
    );
  },
);

Menu.displayName = 'Menu';

export default Menu;
