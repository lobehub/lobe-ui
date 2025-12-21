import type { FlexboxProps } from '@lobehub/ui/Flex';
import type { CSSProperties, Ref } from 'react';

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
