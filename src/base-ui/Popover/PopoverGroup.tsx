'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { type FC, type ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import {
  useDestroyOnInvalidActiveTriggerElement,
  useHidePopupWhenPositionerAtOrigin,
} from '@/utils/destroyOnInvalidActiveTriggerElement';
import { parseTrigger } from '@/utils/parseTrigger';
import { placementMap } from '@/utils/placement';

import { PopoverArrowIcon } from './ArrowIcon';
import {
  PopoverArrow,
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverViewport,
} from './atoms';
import { PopoverProvider } from './context';
import {
  PopoverGroupHandleContext,
  type PopoverGroupItem,
  PopoverGroupPropsContext,
  type PopoverGroupSharedProps,
} from './groupContext';
import { usePopoverPortalContainer } from './PopoverPortal';

type PopoverGroupProps = PopoverGroupSharedProps & {
  children: ReactNode;
};

const PopoverGroup: FC<PopoverGroupProps> = ({
  children,
  contentLayoutAnimation = false,
  disableDestroyOnInvalidTrigger = false,
  disableZeroOriginGuard = false,
  ...sharedProps
}) => {
  const [{ handle, key }, setHandleState] = useState(() => ({
    handle: BasePopover.createHandle<PopoverGroupItem>(),
    key: 0,
  }));
  const activeItemRef = useRef<PopoverGroupItem | null>(null);
  const destroy = useCallback(() => {
    activeItemRef.current = null;
    setHandleState(({ key }) => ({
      handle: BasePopover.createHandle<PopoverGroupItem>(),
      key: key + 1,
    }));
  }, []);
  const close = useCallback(() => {
    handle.close();
  }, [handle]);
  const contextValue = useMemo(() => ({ close }), [close]);

  const handleOpenChange = useCallback((open: boolean) => {
    activeItemRef.current?.onOpenChange?.(open);
  }, []);

  useDestroyOnInvalidActiveTriggerElement(handle.store, destroy, {
    enabled: !disableDestroyOnInvalidTrigger,
  });
  useHidePopupWhenPositionerAtOrigin(handle.store, { enabled: !disableZeroOriginGuard });

  const portalContainer = usePopoverPortalContainer();

  return (
    <PopoverGroupHandleContext value={handle}>
      <PopoverGroupPropsContext value={sharedProps}>
        {children}
        <BasePopover.Root handle={handle} key={key} onOpenChange={handleOpenChange}>
          {({ payload }) => {
            const item = (payload as PopoverGroupItem | null) ?? null;
            activeItemRef.current = item;

            if (!item?.content) return null;

            const arrow = item.arrow ?? false;
            const placement = item.placement ?? 'top';
            const { openOnHover } = parseTrigger(item.trigger ?? 'hover');

            const placementConfig = placementMap[placement] ?? placementMap.top;
            const resolvedSideOffset = arrow ? 10 : 6;

            const resolvedClassNames = {
              arrow: item.classNames?.arrow,
              popup: item.className,
              positioner: item.classNames?.root,
              viewport: item.classNames?.content,
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
              <PopoverPositioner
                align={placementConfig.align}
                className={resolvedClassNames.positioner}
                data-layout-animation={contentLayoutAnimation || undefined}
                hoverTrigger={openOnHover}
                placement={placement}
                side={placementConfig.side}
                sideOffset={resolvedSideOffset}
                style={resolvedStyles.positioner}
                {...item.positionerProps}
              >
                <PopoverPopup
                  className={resolvedClassNames.popup}
                  data-layout-animation={contentLayoutAnimation || undefined}
                  {...item.popupProps}
                >
                  {arrow && (
                    <PopoverArrow className={resolvedClassNames.arrow} style={resolvedStyles.arrow}>
                      {PopoverArrowIcon}
                    </PopoverArrow>
                  )}
                  {contentLayoutAnimation ? (
                    <PopoverViewport
                      className={resolvedClassNames.viewport}
                      style={resolvedStyles.viewport}
                    >
                      {contentNode}
                    </PopoverViewport>
                  ) : (
                    <div className={resolvedClassNames.viewport} style={resolvedStyles.viewport}>
                      {contentNode}
                    </div>
                  )}
                </PopoverPopup>
              </PopoverPositioner>
            );

            return portalContainer ? (
              <PopoverPortal container={portalContainer}>{popup}</PopoverPortal>
            ) : null;
          }}
        </BasePopover.Root>
      </PopoverGroupPropsContext>
    </PopoverGroupHandleContext>
  );
};

PopoverGroup.displayName = 'PopoverGroup';

export default PopoverGroup;
