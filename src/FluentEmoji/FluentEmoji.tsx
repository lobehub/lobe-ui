'use client';

import { memo, useMemo, useState } from 'react';
import { Center } from 'react-layout-kit';

import { useCdnFn } from '@/ConfigProvider';
import Img from '@/Img';

import { useStyles } from './style';
import type { FluentEmojiProps } from './type';
import { genEmojiUrl } from './utils';

const FluentEmoji = memo<FluentEmojiProps>(
  ({ emoji, className, style, type = '3d', size = 40, unoptimized, ref, ...rest }) => {
    const [loadingFail, setLoadingFail] = useState(false);
    const genCdnUrl = useCdnFn();
    const { cx, styles } = useStyles();

    const emojiUrl = useMemo(() => genEmojiUrl(emoji, type), [type, emoji]);

    if (type === 'raw' || !emojiUrl || loadingFail)
      return (
        <Center
          className={cx(styles.container, className)}
          flex={'none'}
          height={size}
          ref={ref}
          role={'img'}
          style={{ fontSize: size * 0.9, ...style }}
          width={size}
          {...rest}
        >
          {emoji}
        </Center>
      );

    return (
      <Img
        alt={emoji}
        className={className}
        height={size}
        loading={'lazy'}
        onError={() => setLoadingFail(true)}
        ref={ref}
        src={genCdnUrl(emojiUrl)}
        style={{ flex: 'none', ...style }}
        unoptimized={unoptimized}
        width={size}
        {...rest}
      />
    );
  },
);

FluentEmoji.displayName = 'FluentEmoji';

export default FluentEmoji;
