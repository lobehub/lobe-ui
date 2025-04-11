import type { Ref } from 'react';

import type { EmojiType } from '@/FluentEmoji/utils';
import type { DivProps } from '@/types';

export interface FluentEmojiProps extends DivProps {
  emoji: string;
  ref?: Ref<HTMLImageElement>;
  size?: number;
  type?: EmojiType;
  unoptimized?: boolean;
}
