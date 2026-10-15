'use client';

import { type ReactNode } from 'react';

import type { VirtualListProps } from './type';
import { useMenuVirtualList } from './useMenuVirtualList';
import { VirtualScrollArea, type VirtualScrollAreaProps } from './VirtualScrollArea';

export interface MenuVirtualListProps
  extends
    Omit<VirtualScrollAreaProps, 'viewport' | 'viewportProps' | 'virtualizerRef'>,
    Pick<VirtualListProps, 'getItemLabel' | 'keepMounted'> {
  children: ReactNode;
}

export const MenuVirtualList = ({
  children,
  getItemLabel,
  keepMounted,
  ...rest
}: MenuVirtualListProps) => {
  const { keepMountedIndices, viewportProps, viewportRef, virtualChildren, virtualizerRef } =
    useMenuVirtualList({ children, enabled: true, getItemLabel, keepMounted });

  return (
    <VirtualScrollArea
      {...rest}
      keepMounted={keepMountedIndices}
      viewportProps={{ ref: viewportRef, ...viewportProps }}
      virtualizerRef={virtualizerRef}
    >
      {virtualChildren}
    </VirtualScrollArea>
  );
};

MenuVirtualList.displayName = 'MenuVirtualList';
