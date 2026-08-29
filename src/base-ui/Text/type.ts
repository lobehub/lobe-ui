import type { CSSProperties, ElementType, HTMLAttributes, Ref } from 'react';

import type { TooltipProps } from '@/base-ui/Tooltip';

export interface TextClassNames {
  root?: string;
}

export interface TextStyles {
  root?: CSSProperties;
}

export interface TextBaseProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
  as?: ElementType;
  classNames?: TextClassNames;
  code?: boolean;
  color?: string;
  delete?: boolean;
  disabled?: boolean;
  ellipsis?:
    | boolean
    | {
        rows?: number;
        tooltip?: boolean | string | Omit<TooltipProps, 'children'>;
        tooltipWhenOverflow?: boolean;
      };
  fontSize?: number | string;
  italic?: boolean;
  lineClamp?: number;
  lineHeight?: CSSProperties['lineHeight'];
  mark?: boolean;
  noWrap?: boolean;
  ref?: Ref<HTMLDivElement>;
  strong?: boolean;
  styles?: TextStyles;
  textDecoration?: CSSProperties['textDecoration'];
  textTransform?: CSSProperties['textTransform'];
  type?: 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  underline?: boolean;
  weight?: 'bold' | 'bolder' | number;
  whiteSpace?: CSSProperties['whiteSpace'];
  wordBreak?: CSSProperties['wordBreak'];
}

export type TextProps<Shiny extends boolean = boolean> = TextBaseProps &
  (Shiny extends true
    ? {
        shiny: true;
        shinyDuration?: CSSProperties['animationDuration'];
      }
    : {
        shiny?: false;
        shinyDuration?: never;
      });
