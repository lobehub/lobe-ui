'use client';

import { memo, useMemo, useState } from 'react';
import { Center } from 'react-layout-kit';

import Img from '@/Img';
import { DivProps } from '@/types';

import { useStyles } from './style';
import { EmojiType, genEmojiUrl } from './utils';

export interface FluentEmojiProps extends DivProps {
  /**
   * @description The emoji character to be rendered
   */
  emoji: string;
  /**
   * @description Size of the emoji
   * @default 40
   */
  size?: number;
  /**
   * @description The type of the FluentUI emoji set to be used
   * @default '3d'
   */
  type?: EmojiType;
  unoptimized?: boolean;
}

const FluentEmoji = memo<FluentEmojiProps>(
  ({ emoji, className, style, type = '3d', size = 40, unoptimized }) => {
    const [loadingFail, setLoadingFail] = useState(false);

    const { cx, styles } = useStyles();

    const emojiUrl = useMemo(() => genEmojiUrl(emoji, type), [type, emoji]);

    if (type === 'pure' || !emojiUrl || loadingFail)
      return (
        <Center
          className={cx(styles.container, className)}
          flex={'none'}
          height={size}
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
        src={emojiUrl}
        style={{ flex: 'none', ...style }}
        unoptimized={unoptimized}
        width={size}
      />
    );
  },
);

export default FluentEmoji;
