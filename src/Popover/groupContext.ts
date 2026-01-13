'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { createContext } from 'react';

import type { PopoverProps } from './type';

export type PopoverGroupItem = Omit<PopoverProps, 'children' | 'open' | 'defaultOpen' | 'ref'>;

export type PopoverGroupSharedProps = Omit<
  PopoverProps,
  'children' | 'content' | 'defaultOpen' | 'open' | 'ref'
> & {
  /**
   * @description Whether to enable content layout animation when switching triggers
   * @default false
   */
  contentLayoutAnimation?: boolean;
  /**
   * Disable the "destroy on invalid trigger (display:none / disconnected)" guard for performance.
   * @default false
   */
  disableDestroyOnInvalidTrigger?: boolean;
  /**
   * Disable the "hide when positioner falls back to (0,0)" visual guard for performance.
   * @default false
   */
  disableZeroOriginGuard?: boolean;
};

export type PopoverGroupHandle = ReturnType<typeof BasePopover.createHandle<PopoverGroupItem>>;

export const PopoverGroupHandleContext = createContext<PopoverGroupHandle | null>(null);
export const PopoverGroupPropsContext = createContext<PopoverGroupSharedProps | null>(null);
