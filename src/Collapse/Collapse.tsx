'use client';

import { Collapse as AntdCollapse, ConfigProvider } from 'antd';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { memo, useMemo } from 'react';

import Icon from '@/Icon';

import { DEFAULT_PADDING, getPadding, useStyles } from './style';
import type { CollapseProps } from './type';

const Collapse = memo<CollapseProps>(
  ({
    style,
    variant = 'filled',
    gap = 0,
    className,
    padding = DEFAULT_PADDING,
    size,
    collapsible = true,
    ref,
    ...rest
  }) => {
    const { cx, styles } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          compoundVariants: [
            {
              class: styles.gapOutlined,
              gap: true,
              variant: 'outlined',
            },
            {
              class: styles.gapOutlined,
              gap: true,
              variant: 'filled',
            },
          ],
          defaultVariants: {
            collapsible: true,
            gap: false,
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            gap: {
              false: null,
              true: styles.gapRoot,
            },
            collapsible: {
              false: styles.hideCollapsibleIcon,
              true: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              contentPadding: typeof padding === 'object' ? getPadding(padding?.body) : padding,
              headerPadding: typeof padding === 'object' ? getPadding(padding?.header) : padding,
            },
          },
        }}
      >
        <AntdCollapse
          bordered={false}
          className={cx(variants({ collapsible, gap: !!gap, variant }), className)}
          collapsible={collapsible ? 'header' : 'icon'}
          expandIcon={({ isActive }) => (
            <Icon
              className={styles.icon}
              icon={ChevronDown}
              size={size === 'large' ? 'middle' : 'small'}
              style={isActive ? {} : { rotate: '-90deg' }}
            />
          )}
          ghost
          ref={ref}
          size={size}
          style={{
            gap,
            ...style,
          }}
          {...rest}
        />
      </ConfigProvider>
    );
  },
);

Collapse.displayName = 'Collapse';

export default Collapse;
