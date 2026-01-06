'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import type { Side } from '@base-ui/react/utils/useAnchorPositioning';
import { cx } from 'antd-style';
import { type FC, type ReactNode, useCallback, useMemo, useRef } from 'react';

import { placementMap } from '@/utils/placement';

import { PopoverArrowIcon } from './ArrowIcon';
import { usePopoverPortalContainer } from './PopoverPortal';
import { PopoverProvider } from './context';
import {
  PopoverGroupHandleContext,
  type PopoverGroupItem,
  PopoverGroupPropsContext,
  type PopoverGroupSharedProps,
} from './groupContext';
import { parseTrigger } from './parseTrigger';
import { styles } from './style';

type PopoverGroupProps = PopoverGroupSharedProps & {
  children: ReactNode;
};

const PopoverGroup: FC<PopoverGroupProps> = ({
  children,
  contentLayoutAnimation = true,
  ...sharedProps
}) => {
  const handle = useMemo(() => BasePopover.createHandle<PopoverGroupItem>(), []);
  const activeItemRef = useRef<PopoverGroupItem | null>(null);
  const close = useCallback(() => {
    handle.close();
  }, [handle]);
  const contextValue = useMemo(() => ({ close }), [close]);

  const handleOpenChange = useCallback((open: boolean) => {
    activeItemRef.current?.onOpenChange?.(open);
  }, []);

  const portalContainer = usePopoverPortalContainer();

  return (
    <PopoverGroupHandleContext.Provider value={handle}>
      <PopoverGroupPropsContext.Provider value={sharedProps}>
        {children}
        <BasePopover.Root handle={handle} onOpenChange={handleOpenChange}>
          {({ payload }) => {
            const item = (payload as PopoverGroupItem | null) ?? null;
            activeItemRef.current = item;

            if (!item?.content) return null;

            const arrow = item.inset ? false : (item.arrow ?? true);
            const placement = item.placement ?? 'top';
            const { openOnHover } = parseTrigger(item.trigger ?? 'hover');

            const placementConfig = placementMap[placement] ?? placementMap.top;
            const baseSideOffset = arrow ? 10 : 6;
            const resolvedSideOffset = item.inset
              ? ({
                  side,
                  positioner,
                }: {
                  positioner: { height: number; width: number };
                  side: Side;
                }) => {
                  if (
                    side === 'left' ||
                    side === 'right' ||
                    side === 'inline-start' ||
                    side === 'inline-end'
                  ) {
                    return -positioner.width;
                  }
                  return -positioner.height;
                }
              : baseSideOffset;

            const resolvedClassNames = {
              arrow: cx(styles.arrow, item.classNames?.arrow),
              popup: cx(styles.popup, item.className),
              positioner: cx(styles.positioner, item.classNames?.root),
              viewport: cx(styles.viewport, item.classNames?.content),
            };

            const resolvedStyles = {
              arrow: item.styles?.arrow,
              positioner: {
                ...item.styles?.root,
                zIndex: item.zIndex ?? 1100,
              },
              viewport: item.styles?.content,
            };

            const contentNode = (
              <PopoverProvider value={contextValue}>{item.content}</PopoverProvider>
            );

            const popup = (
              <BasePopover.Positioner
                align={placementConfig.align}
                className={resolvedClassNames.positioner}
                data-hover-trigger={openOnHover || undefined}
                data-placement={placement}
                side={placementConfig.side}
                sideOffset={resolvedSideOffset}
                style={resolvedStyles.positioner}
              >
                <BasePopover.Popup className={resolvedClassNames.popup}>
                  {arrow && (
                    <BasePopover.Arrow
                      className={resolvedClassNames.arrow}
                      style={resolvedStyles.arrow}
                    >
                      {PopoverArrowIcon}
                    </BasePopover.Arrow>
                  )}
                  {contentLayoutAnimation ? (
                    <BasePopover.Viewport
                      className={resolvedClassNames.viewport}
                      style={resolvedStyles.viewport}
                    >
                      {contentNode}
                    </BasePopover.Viewport>
                  ) : (
                    <div className={resolvedClassNames.viewport} style={resolvedStyles.viewport}>
                      {contentNode}
                    </div>
                  )}
                </BasePopover.Popup>
              </BasePopover.Positioner>
            );

            const resolvedPortalContainer = portalContainer;
            const portalled = item.portalled ?? true;

            return portalled ? (
              resolvedPortalContainer ? (
                <BasePopover.Portal container={resolvedPortalContainer}>{popup}</BasePopover.Portal>
              ) : null
            ) : (
              popup
            );
          }}
        </BasePopover.Root>
      </PopoverGroupPropsContext.Provider>
    </PopoverGroupHandleContext.Provider>
  );
};

PopoverGroup.displayName = 'PopoverGroup';

export default PopoverGroup;
