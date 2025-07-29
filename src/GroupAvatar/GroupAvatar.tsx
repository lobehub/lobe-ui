'use client';

import { memo, useMemo } from 'react';

import Avatar from '@/Avatar';
import Block from '@/Block';
import Grid from '@/Grid';
import { getSmoothCornersMaskStyle } from '@/utils/smoothCorners';

import { useStyles } from './style';
import type { GroupAvatarProps } from './type';

const GroupAvatar = memo<GroupAvatarProps>(
  ({
    className,
    style,
    avatars = [],
    size = 32,
    cornerShape = 'squircle',
    avatarShape = 'circle',
    ...rest
  }) => {
    const { cx, styles } = useStyles();
    const smoothCornersMask = useMemo(() => getSmoothCornersMaskStyle(cornerShape), [cornerShape]);
    const calcSize = useMemo(() => {
      const isCircle = cornerShape === 'circle';
      const avatarSize = Math.floor((size / 2) * (isCircle ? 0.65 : 0.75));
      const gapSize = Math.floor((size - avatarSize * 2) / (isCircle ? 6 : 4));

      return {
        avatarSize,
        gapSize,
        gridWidth: avatarSize * 2 + gapSize,
        maxItemWidth: avatarSize - 1,
      };
    }, [size, cornerShape]);

    return (
      <Block
        align={'center'}
        className={cx(styles.root, className)}
        height={size}
        justify={'center'}
        style={{
          ...smoothCornersMask,
          ...style,
        }}
        width={size}
        {...rest}
      >
        <Grid
          gap={calcSize.gapSize}
          maxItemWidth={calcSize.maxItemWidth}
          rows={2}
          width={calcSize.gridWidth}
        >
          {avatars?.slice(0, 4).map((item, index) => {
            if (typeof item === 'string') {
              return (
                <Avatar avatar={item} key={index} shape={avatarShape} size={calcSize.avatarSize} />
              );
            }
            return <Avatar key={index} {...item} shape={avatarShape} size={calcSize.avatarSize} />;
          })}
        </Grid>
      </Block>
    );
  },
);

export default GroupAvatar;
