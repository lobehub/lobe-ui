'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { createContext } from 'react';

import type { TooltipProps } from './type';

export type TooltipGroupItem = Omit<TooltipProps, 'children' | 'open' | 'defaultOpen' | 'ref'>;

export type TooltipGroupSharedProps = Omit<
  TooltipProps,
  'children' | 'defaultOpen' | 'open' | 'ref' | 'title'
> & {
  /**
   * @description Whether to enable content layout animation when switching triggers
   * @default false
   */
  layoutAnimation?: boolean;
};

export type TooltipGroupHandle = ReturnType<typeof BaseTooltip.createHandle<TooltipGroupItem>>;

export const TooltipGroupHandleContext = createContext<TooltipGroupHandle | null>(null);
export const TooltipGroupPropsContext = createContext<TooltipGroupSharedProps | null>(null);
