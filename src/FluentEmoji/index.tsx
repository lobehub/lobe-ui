'use client';

import { memo, useMemo, useState } from 'react';
import { Center } from 'react-layout-kit';

import { useCdnFn } from '@/ConfigProvider';
import Img from '@/Img';
import { DivProps } from '@/types';

import { useStyles } from './style';
import { EmojiType, genEmojiUrl } from './utils';

export interface FluentEmojiProps extends DivProps {
  emoji: string;
  size?: number;
  type?: EmojiType;
  unoptimized?: boolean;
}

const FluentEmoji = memo<FluentEmojiProps>(
  ({ emoji, className, style, type = '3d', size = 40, unoptimized }) => {
    const [loadingFail, setLoadingFail] = useState(false);
    const genCdnUrl = useCdnFn();
    const { cx, styles } = useStyles();

    const emojiUrl = useMemo(() => genEmojiUrl(emoji, type), [type, emoji]);

    if (type === 'pure' || !emojiUrl || loadingFail)
      return (
        <Center
          className={cx(styles.container, className)}
          flex={'none'}
          height={size}
          role={'img'}
          style={{ fontSize: size * 0.9, ...style }}
          width={size}
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
        src={genCdnUrl(emojiUrl)}
        style={{ flex: 'none', ...style }}
        unoptimized={unoptimized}
        width={size}
      />
    );
  },
);

FluentEmoji.displayName = 'FluentEmoji';

export default FluentEmoji;
