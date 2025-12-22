import { createContext } from 'react';

import type { TooltipProps } from './type';

export type TooltipGroupItem = Omit<TooltipProps, 'children' | 'open' | 'defaultOpen'>;

export type TooltipGroupSharedProps = Omit<
  TooltipProps,
  'children' | 'defaultOpen' | 'open' | 'ref' | 'title'
>;

export type TooltipGroupApi = {
  closeFromTrigger: (triggerEl: HTMLElement, item: TooltipGroupItem) => void;
  closeImmediately: () => void;
  isActiveTrigger: (triggerEl: HTMLElement) => boolean;
  openFromTrigger: (triggerEl: HTMLElement, item: TooltipGroupItem) => void;
};

export const TooltipGroupApiContext = createContext<TooltipGroupApi | null>(null);
export const TooltipGroupPropsContext = createContext<TooltipGroupSharedProps | null>(null);
