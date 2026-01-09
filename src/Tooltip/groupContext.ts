'use client';

import type { TooltipHandle } from '@base-ui/react/tooltip/store/TooltipHandle';
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

export const TooltipGroupHandleContext = createContext<TooltipHandle<TooltipGroupItem> | null>(
  null,
);
export const TooltipGroupPropsContext = createContext<TooltipGroupSharedProps | null>(null);
