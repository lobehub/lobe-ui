'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import React, {
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useId,
  useSyncExternalStore,
} from 'react';

import { getServerSnapshot, getSnapshot, subscribe } from './store';

export type ContextMenuTriggerProps = {
  children: ReactNode;
  onContextMenu?: (event: MouseEvent<HTMLElement>) => void;
} & Omit<HTMLAttributes<HTMLElement>, 'onContextMenu' | 'children'>;

const styles = {
  trigger: {
    display: 'contents',
  },
};

export const ContextMenuTrigger = memo<ContextMenuTriggerProps>(
  ({ children, onContextMenu, ...rest }) => {
    const triggerId = useId();
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const open = state.open && state.triggerId === triggerId;

    const handleContextMenu = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        onContextMenu?.(event);
      },
      [onContextMenu],
    );

    const triggerProps = {
      ...rest,
      'aria-expanded': open || undefined,
      'data-contextmenu-trigger': triggerId,
      'data-popup-open': open ? '' : undefined,
      'data-state': open ? 'open' : undefined,
      'onContextMenu': handleContextMenu,
    };

    if (isValidElement(children) && React.Children.only(children)) {
      return cloneElement(children, mergeProps(children.props as any, triggerProps));
    }

    return (
      <span style={styles.trigger} {...triggerProps}>
        {children}
      </span>
    );
  },
);

ContextMenuTrigger.displayName = 'ContextMenuTrigger';
