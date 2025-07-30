'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo } from 'react';

import Avatar from '@/Avatar';
import Block from '@/Block';
import Grid from '@/Grid';

import { useStyles } from './style';
import type { GroupAvatarProps } from './type';

const GroupAvatar = memo<GroupAvatarProps>(
  ({
    className,
    style,
    avatars = [],
    size = 32,
    grid = 2,
    cornerShape = 'squircle',
    avatarShape = 'circle',
    ...rest
  }) => {
    const { cx, styles } = useStyles();

    const calcSize = useMemo(() => {
      const length = avatars.length;
      const isAutoGrid = grid === 'auto';
      const gridSize = isAutoGrid ? (length > 4 ? 3 : 2) : grid;
      const isCircle = cornerShape === 'circle';
      const avatarSize = Math.floor((size / gridSize) * (isCircle ? 0.65 : 0.75));
      const gapSize = Math.floor((size - avatarSize * gridSize) / (isCircle ? 6 : 4));

      return {
        avatarSize,
        gapSize,
        gridSize,
        gridWidth: avatarSize * gridSize + gapSize,
        maxItemWidth: avatarSize - 1,
      };
    }, [avatars, grid, size, cornerShape]);

    const calcAvatars = useMemo(
      () => avatars?.slice(0, calcSize.gridSize * calcSize.gridSize),
      [avatars, calcSize.gridSize],
    );

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            cornerShape: 'squircle',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            cornerShape: {
              circle: styles.circle,
              ios: styles.ios,
              sharp: styles.sharp,
              smooth: styles.smooth,
              square: styles.square,
              squircle: styles.squircle,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Block
        align={'center'}
        className={cx(variants({ cornerShape }), className)}
        height={size}
        justify={'center'}
        style={style}
        width={size}
        {...rest}
      >
        <Grid
          gap={calcSize.gapSize}
          maxItemWidth={0}
          rows={calcSize.gridSize}
          width={calcSize.gridWidth}
        >
          {calcAvatars.map((item, index) => {
            if (typeof item === 'string')
              return (
                <Avatar avatar={item} key={index} shape={avatarShape} size={calcSize.avatarSize} />
              );
            return <Avatar key={index} {...item} shape={avatarShape} size={calcSize.avatarSize} />;
          })}
        </Grid>
      </Block>
    );
  },
);

export default GroupAvatar;
