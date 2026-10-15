'use client';

import { type FC, useMemo, useState } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import { Center } from '@/Flex';
import Img from '@/Img';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { FluentEmojiProps } from './type';
import { genEmojiUrl } from './utils';

const FluentEmoji: FC<FluentEmojiProps> = ({
  emoji,
  className,
  style,
  type = '3d',
  size = 40,
  unoptimized,
  ref,
  ...rest
}) => {
  const [loadingFail, setLoadingFail] = useState(false);
  const genCdnUrl = useCdnFn();

  const emojiUrl = useMemo(() => genEmojiUrl(emoji, type), [type, emoji]);

  if (type === 'raw' || !emojiUrl || loadingFail)
    return (
      <Center
        flex={'none'}
        height={size}
        ref={ref}
        role={'img'}
        width={size}
        {...rest}
        {...styleProps(styles.container, className, { fontSize: size * 0.9, ...style })}
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
      ref={ref}
      src={genCdnUrl(emojiUrl)}
      style={{ flex: 'none', ...style }}
      unoptimized={unoptimized}
      width={size}
      onError={() => setLoadingFail(true)}
      {...rest}
    />
  );
};

FluentEmoji.displayName = 'FluentEmoji';

export default FluentEmoji;
