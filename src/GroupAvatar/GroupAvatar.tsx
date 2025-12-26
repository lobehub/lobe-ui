'use client';

import { cx } from 'antd-style';
import { type FC, useMemo } from 'react';

import Avatar from '@/Avatar';
import Block from '@/Block';
import Grid from '@/Grid';

import { variants } from './style';
import type { GroupAvatarProps } from './type';

const GroupAvatar: FC<GroupAvatarProps> = ({
  className,
  style,
  avatars = [],
  size = 32,
  grid = 2,
  cornerShape = 'square',
  avatarShape = 'square',
  ...rest
}) => {
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

  const isSingle = calcAvatars?.length === 1;

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
              <Avatar
                avatar={item}
                key={index}
                shape={avatarShape}
                size={isSingle ? size * 0.8 : calcSize.avatarSize}
              />
            );
          return (
            <Avatar
              key={index}
              {...item}
              shape={avatarShape}
              size={isSingle ? size * 0.8 : calcSize.avatarSize}
            />
          );
        })}
      </Grid>
    </Block>
  );
};

export default GroupAvatar;
