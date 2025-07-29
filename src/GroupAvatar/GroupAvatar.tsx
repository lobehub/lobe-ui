'use client';

import { memo, useMemo } from 'react';

import Avatar from '@/Avatar';
import Block from '@/Block';
import Grid from '@/Grid';
import { getSmoothCornersMaskStyle } from '@/utils/smoothCorners';

import { useStyles } from './style';
import type { GroupAvatarProps } from './type';

const GroupAvatar = memo<GroupAvatarProps>(
  ({ className, style, avatars = [], size = 32, smoothCornerType = 'squircle', ...rest }) => {
    const { cx, styles } = useStyles();
    const smoothCornersMask = useMemo(
      () => getSmoothCornersMaskStyle(smoothCornerType),
      [smoothCornerType],
    );
    const calcSize = useMemo(() => {
      const avatarSize = Math.floor((size / 2) * 0.75);
      const gapSize = Math.floor((size - avatarSize * 2) / 4);

      return {
        avatarSize,
        gapSize,
        gridWidth: avatarSize * 2 + gapSize,
        maxItemWidth: avatarSize - 1,
      };
    }, [size]);

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
              return <Avatar avatar={item} key={index} size={calcSize.avatarSize} />;
            }
            return <Avatar key={index} {...item} size={calcSize.avatarSize} />;
          })}
        </Grid>
      </Block>
    );
  },
);

export default GroupAvatar;
