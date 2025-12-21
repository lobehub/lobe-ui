import type { Ref } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface ScrollShadowProps extends FlexboxProps {
  hideScrollBar?: boolean;
  isEnabled?: boolean;
  offset?: number;
  onVisibilityChange?: (visibility: {
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
  }) => void;
  orientation?: 'vertical' | 'horizontal';
  ref?: Ref<HTMLDivElement>;
  size?: number;
  visibility?: 'auto' | 'always' | 'never';
}
