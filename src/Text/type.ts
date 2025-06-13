import type { ElementType, ReactNode, Ref } from 'react';

import type { TooltipProps } from '@/Tooltip';
import { DivProps } from '@/types';

export interface TextProps extends DivProps {
  as?: ElementType;
  code?: boolean;
  color?: string;
  delete?: boolean;
  disabled?: boolean;
  ellipsis?:
    | boolean
    | {
        rows?: number;
        tooltip?: ReactNode | TooltipProps;
      };
  fontSize?: number | string;
  italic?: boolean;
  mark?: boolean;
  ref?: Ref<HTMLDivElement>;
  strong?: boolean;
  type?: 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  underline?: boolean;
  weight?: 'bold' | 'bolder' | number;
}
