import type { FlexboxProps } from 'react-layout-kit';

export interface MaskShadowProps extends FlexboxProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: number;
  visibility?: 'auto' | 'always' | 'never';
}
