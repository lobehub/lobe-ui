import { createContext } from 'react';

import type { TooltipProps } from './type';

export type TooltipGroupItem = Omit<TooltipProps, 'children' | 'open' | 'defaultOpen'>;

export type TooltipGroupSharedProps = Omit<
  TooltipProps,
  'children' | 'defaultOpen' | 'open' | 'ref' | 'title'
> & {
  /**
   * @description Whether to enable layout animation when switching between tooltips
   * @default true
   */
  layoutAnimation?: boolean;
};
export const TooltipGroupPropsContext = createContext<TooltipGroupSharedProps | null>(null);
