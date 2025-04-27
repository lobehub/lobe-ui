import { FlexboxProps } from 'react-layout-kit';

import type { DivProps } from '@/types';

export interface GridBackgroundProps extends DivProps {
  animation?: boolean;
  animationDuration?: number;
  backgroundColor?: string;
  colorBack?: string;
  colorFront?: string;
  flip?: boolean;
  random?: boolean;
  reverse?: boolean;
  showBackground?: boolean;
  strokeWidth?: number;
}

export interface GridShowcaseProps extends FlexboxProps {
  backgroundColor?: GridBackgroundProps['backgroundColor'];
  innerProps?: FlexboxProps;
}
