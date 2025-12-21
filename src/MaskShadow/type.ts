import type { FlexboxProps } from '@/Flex';

export interface MaskShadowProps extends FlexboxProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: number;
  visibility?: 'auto' | 'always' | 'never';
}
