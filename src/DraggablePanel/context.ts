'use client';

import { createContext, use } from 'react';

import type { Axis, Placement } from './core/axes';
import type { PanelController, PanelState } from './core/controller';

export interface DraggablePanelContextValue {
  axis: Axis;
  controller: PanelController;
  expand: boolean;
  expandable: boolean;
  placement: Placement;
  showBorder: boolean;
  state: PanelState;
  toggleExpand: () => void;
}

export const DraggablePanelContext = createContext<DraggablePanelContextValue | null>(null);

export const useDraggablePanelContext = () => {
  const context = use(DraggablePanelContext);
  if (!context) throw new Error('DraggablePanel atoms must be used inside DraggablePanelRoot');
  return context;
};
