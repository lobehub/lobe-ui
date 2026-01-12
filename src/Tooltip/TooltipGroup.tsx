'use client';

import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { cx } from 'antd-style';
import { type FC, useCallback, useRef, useState } from 'react';

import { useDestroyOnInvalidActiveTriggerElement } from '@/utils/destroyOnInvalidActiveTriggerElement';
import { placementMap } from '@/utils/placement';

import { TooltipArrowIcon } from './ArrowIcon';
import TooltipContent from './TooltipContent';
import { useTooltipPortalContainer } from './TooltipPortal';
import {
  TooltipGroupHandleContext,
  type TooltipGroupItem,
  TooltipGroupPropsContext,
} from './groupContext';
import { styles } from './style';
import type { TooltipGroupProps } from './type';

const TooltipGroup: FC<TooltipGroupProps> = ({
  children,
  layoutAnimation = false,
  ...sharedProps
}) => {
  const [{ handle, key }, setHandleState] = useState(() => ({
    handle: BaseTooltip.createHandle<TooltipGroupItem>(),
    key: 0,
  }));
  const activeItemRef = useRef<TooltipGroupItem | null>(null);

  const destroy = useCallback(() => {
    activeItemRef.current = null;
    setHandleState(({ key }) => ({
      handle: BaseTooltip.createHandle<TooltipGroupItem>(),
      key: key + 1,
    }));
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    activeItemRef.current?.onOpenChange?.(open);
  }, []);

  const portalContainer = useTooltipPortalContainer();

  useDestroyOnInvalidActiveTriggerElement(handle.store, destroy);

  return (
    <TooltipGroupHandleContext.Provider value={handle}>
      <TooltipGroupPropsContext.Provider value={sharedProps}>
        {children}
        <BaseTooltip.Root handle={handle} key={key} onOpenChange={handleOpenChange}>
          {({ payload }) => {
            const item = (payload as TooltipGroupItem | null) ?? null;
            activeItemRef.current = item;

            // eslint-disable-next-line eqeqeq
            if (!item || (item.title == null && !item.hotkey)) return null;

            const arrow = item.arrow ?? false;
            const placement = item.placement ?? 'top';
            const placementConfig = placementMap[placement] ?? placementMap.top;
            const baseSideOffset = arrow ? 8 : 6;

            const resolvedClassNames = {
              arrow: cx(styles.arrow, item.classNames?.arrow),
              popup: cx(
                styles.popup,
                item.className,
                item.classNames?.root,
                item.classNames?.container,
              ),
              positioner: styles.positioner,
              viewport: cx(styles.viewport, item.classNames?.content),
            };

            const resolvedStyleProps = (() => {
              if (typeof item.styles === 'function') return undefined;
              return item.styles;
            })();

            const resolvedStyles = {
              arrow: resolvedStyleProps?.arrow,
              popup: {
                ...resolvedStyleProps?.root,
                ...resolvedStyleProps?.container,
              },
              positioner: {
                zIndex: item.zIndex ?? 1100,
              },
              viewport: resolvedStyleProps?.content,
            };

            const body = layoutAnimation ? (
              <BaseTooltip.Viewport
                className={resolvedClassNames.viewport}
                style={resolvedStyles.viewport}
              >
                <TooltipContent
                  hotkey={item.hotkey}
                  hotkeyProps={item.hotkeyProps}
                  title={item.title}
                />
              </BaseTooltip.Viewport>
            ) : (
              <div className={resolvedClassNames.viewport} style={resolvedStyles.viewport}>
                <TooltipContent
                  hotkey={item.hotkey}
                  hotkeyProps={item.hotkeyProps}
                  title={item.title}
                />
              </div>
            );

            const popup = (
              <BaseTooltip.Positioner
                align={placementConfig.align}
                className={resolvedClassNames.positioner}
                data-placement={placement}
                side={placementConfig.side}
                sideOffset={baseSideOffset}
                style={resolvedStyles.positioner}
                {...item.positionerProps}
              >
                <BaseTooltip.Popup
                  className={resolvedClassNames.popup}
                  style={resolvedStyles.popup}
                  {...item.popupProps}
                >
                  {arrow && (
                    <BaseTooltip.Arrow
                      className={resolvedClassNames.arrow}
                      style={resolvedStyles.arrow}
                    >
                      {TooltipArrowIcon}
                    </BaseTooltip.Arrow>
                  )}
                  {body}
                </BaseTooltip.Popup>
              </BaseTooltip.Positioner>
            );

            return portalContainer ? (
              <BaseTooltip.Portal container={portalContainer}>{popup}</BaseTooltip.Portal>
            ) : null;
          }}
        </BaseTooltip.Root>
      </TooltipGroupPropsContext.Provider>
    </TooltipGroupHandleContext.Provider>
  );
};

TooltipGroup.displayName = 'TooltipGroup';

export default TooltipGroup;
