import type { CSSProperties, Ref } from 'react';

import type { FlexboxProps } from '@/Flex';

export interface AuroraBackgroundProps extends FlexboxProps {
  classNames?: {
    content?: string;
    wrapper?: string;
  };
  ref?: Ref<HTMLDivElement>;
  styles?: {
    content?: CSSProperties;
    wrapper?: CSSProperties;
  };
}
