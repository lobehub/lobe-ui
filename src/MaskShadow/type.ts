import type { FlexboxProps } from '@lobehub/ui/Flex';

export interface MaskShadowProps extends FlexboxProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: number;
  visibility?: 'auto' | 'always' | 'never';
}
