'use client';

import { Tag as AntTag, type TagProps as AntTagProps } from 'antd';
import { cva } from 'class-variance-authority';
import { mix, readableColor } from 'polished';
import { forwardRef, useMemo } from 'react';

import { useStyles } from './styles';

export interface TagProps extends AntTagProps {
  size?: 'small' | 'middle' | 'large';
  variant?: 'filled' | 'outlined' | 'borderless';
}

const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ size = 'middle', color, variant = 'filled', children, onClick, style, ...rest }, ref) => {
    const { styles, cx } = useStyles();

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            size: 'middle',
            variant: 'filled',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            variant: {
              filled: styles.filled,
              outlined: styles.outlined,
              borderless: styles.borderless,
            },
            size: {
              small: styles.small,
              middle: null,
              large: styles.large,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    const isHexColor = color && color.startsWith('#');

    return (
      <AntTag
        bordered={false}
        className={cx(variants({ size, variant }))}
        color={color}
        onClick={onClick}
        ref={ref}
        style={{
          color: isHexColor ? mix(0.75, readableColor(color), color) : undefined,
          cursor: onClick ? 'pointer' : undefined,
          fontWeight: isHexColor ? 500 : undefined,
          ...style,
        }}
        {...rest}
      >
        {children}
      </AntTag>
    );
  },
);

Tag.displayName = 'Tag';

export default Tag;
