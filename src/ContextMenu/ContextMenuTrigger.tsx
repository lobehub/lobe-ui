'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import clsx from 'clsx';
import React, {
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  memo,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useId,
  useSyncExternalStore,
} from 'react';

import { CLASSNAMES } from '@/styles/classNames';

import { getServerSnapshot, getSnapshot, showContextMenu, subscribe } from './store';
import { type ContextMenuItem } from './type';

export type ContextMenuTriggerProps = {
  children: ReactNode;
  /**
   * Menu items to display. Supports lazy rendering via function.
   * When provided, context menu will be automatically shown on right-click.
   */
  items?: ContextMenuItem[] | (() => ContextMenuItem[]);
  /**
   * Custom context menu handler. If `items` is provided, this is optional.
   */
  onContextMenu?: (event: MouseEvent<HTMLElement>) => void;
} & Omit<HTMLAttributes<HTMLElement>, 'onContextMenu' | 'children'>;

const styles = {
  trigger: {
    display: 'contents',
  },
};

export const ContextMenuTrigger = memo<ContextMenuTriggerProps>(
  ({ children, items, onContextMenu, ...rest }) => {
    const triggerId = useId();
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const open = state.open && state.triggerId === triggerId;

    const handleContextMenu = useCallback(
      (event: MouseEvent<HTMLElement>) => {
        if (items) {
          event.preventDefault();
          const resolvedItems = typeof items === 'function' ? items() : items;
          showContextMenu(resolvedItems);
        }
        onContextMenu?.(event);
      },
      [items, onContextMenu],
    );

    const triggerProps = {
      ...rest,
      'aria-expanded': open || undefined,
      'className': clsx(CLASSNAMES.ContextTrigger, rest.className),
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
