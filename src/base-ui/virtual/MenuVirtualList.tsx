'use client';

import { type ReactNode } from 'react';

import { useMenuVirtualList } from './useMenuVirtualList';
import { VirtualScrollArea, type VirtualScrollAreaProps } from './VirtualScrollArea';

export interface MenuVirtualListProps extends Omit<
  VirtualScrollAreaProps,
  'viewport' | 'viewportProps'
> {
  children: ReactNode;
}

export const MenuVirtualList = ({ children, keepMounted, ...rest }: MenuVirtualListProps) => {
  const { keepMountedIndices, scrollGuardProps, viewportRef, virtualChildren } = useMenuVirtualList(
    { children, enabled: true, keepMounted },
  );

  return (
    <VirtualScrollArea
      {...rest}
      keepMounted={keepMountedIndices}
      viewportProps={{ ref: viewportRef, ...scrollGuardProps }}
    >
      {virtualChildren}
    </VirtualScrollArea>
  );
};

MenuVirtualList.displayName = 'MenuVirtualList';
