'use client';

import { cx } from 'antd-style';
import { X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { memo, useCallback, useMemo } from 'react';

import {
  DrawerBackdrop,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPopup,
  DrawerPortal,
  DrawerRoot,
  type DrawerRootProps,
  DrawerTitle,
} from './atoms';
import {
  DEFAULT_CONTAINER_MAX_WIDTH,
  DEFAULT_DRAWER_HEIGHT,
  DEFAULT_DRAWER_WIDTH,
  DEFAULT_PUSH_DISTANCE,
  DEFAULT_SIDEBAR_WIDTH,
} from './constants';
import { DrawerPushProvider, useDrawerPush } from './DrawerPushContext';
import { styles } from './style';
import type { DrawerProps, DrawerPush } from './type';

const resolvePushDistance = (push: DrawerPush) => {
  if (push === false) return 0;
  if (push === true) return DEFAULT_PUSH_DISTANCE;
  return push.distance ?? DEFAULT_PUSH_DISTANCE;
};

const FULL_SIZES = new Set(['100%', '100dvh', '100dvw', '100vh', '100vw']);

const Drawer = memo<DrawerProps>(
  ({
    open,
    placement = 'right',
    width,
    height,
    mask = true,
    maskClosable = true,
    keyboard = true,
    closable = true,
    closeIcon,
    extra,
    title,
    footer,
    noHeader,
    sidebar,
    sidebarWidth = DEFAULT_SIDEBAR_WIDTH,
    containerMaxWidth = DEFAULT_CONTAINER_MAX_WIDTH,
    push = true,
    zIndex,
    getContainer,
    className,
    classNames,
    style,
    styles: semanticStyles,
    afterOpenChange,
    onClose,
    children,
  }) => {
    const isOpen = open ?? false;
    const { childValue, pushed } = useDrawerPush(isOpen);
    const pushOffset = pushed ? resolvePushDistance(push) : 0;

    const handleOpenChange = useCallback<NonNullable<DrawerRootProps['onOpenChange']>>(
      (nextOpen, eventDetails) => {
        if (nextOpen || !isOpen) return;
        if (!keyboard && eventDetails.reason === 'escape-key') return;
        if (!maskClosable && eventDetails.reason === 'outside-press') return;
        onClose?.();
      },
      [isOpen, keyboard, maskClosable, onClose],
    );

    const handleExitComplete = useCallback(() => afterOpenChange?.(false), [afterOpenChange]);
    const handleAnimationComplete = useCallback(() => {
      if (isOpen) afterOpenChange?.(true);
    }, [isOpen, afterOpenChange]);

    const isHorizontal = placement === 'left' || placement === 'right';
    const resolvedWidth = isHorizontal ? (width ?? DEFAULT_DRAWER_WIDTH) : width;
    const resolvedHeight = isHorizontal ? height : (height ?? DEFAULT_DRAWER_HEIGHT);

    const isFlush = FULL_SIZES.has(String(isHorizontal ? resolvedWidth : resolvedHeight));
    const surfaceWeightClass = (() => {
      if (isFlush) return undefined;
      if (pushed) return styles.panelRecessed;
      return mask ? undefined : styles.panelBoosted;
    })();

    const showTitle = title !== undefined && title !== null;
    const showHeader = !noHeader && (showTitle || closable || !!extra);
    const hasSidebar = !!sidebar;

    const containerStyle = useMemo<CSSProperties>(
      () => ({ maxWidth: containerMaxWidth }),
      [containerMaxWidth],
    );

    const closeNode = closable && (
      <button
        aria-label="Close"
        className={cx(styles.close, classNames?.close)}
        style={semanticStyles?.close}
        type="button"
        onClick={onClose}
      >
        {closeIcon ?? <X size={16} />}
      </button>
    );

    const extraNode = (extra || closeNode) && (
      <div
        className={cx(styles.extra, !showHeader && styles.extraFloating, classNames?.extra)}
        style={semanticStyles?.extra}
      >
        {extra}
        {closeNode}
      </div>
    );

    const bodyNode = hasSidebar ? (
      <>
        <div
          className={cx(styles.sidebar, classNames?.sidebar)}
          style={{ width: sidebarWidth, ...semanticStyles?.sidebar }}
        >
          {sidebar}
        </div>
        <div
          className={cx(styles.sidebarContent, classNames?.sidebarContent)}
          style={semanticStyles?.sidebarContent}
        >
          {children}
        </div>
      </>
    ) : (
      children
    );

    const container = getContainer === false ? undefined : (getContainer ?? undefined);

    return (
      <DrawerRoot
        modal={mask}
        open={isOpen}
        zIndex={zIndex}
        onExitComplete={handleExitComplete}
        onOpenChange={handleOpenChange}
      >
        <DrawerPortal container={container}>
          {mask && (
            <DrawerBackdrop className={classNames?.backdrop} style={semanticStyles?.backdrop} />
          )}
          <DrawerPopup
            className={classNames?.popup}
            flush={isFlush}
            height={resolvedHeight}
            motionProps={{ onAnimationComplete: handleAnimationComplete }}
            panelClassName={cx(surfaceWeightClass, className, classNames?.panel)}
            panelStyle={{ ...style, ...semanticStyles?.panel }}
            placement={placement}
            popupStyle={semanticStyles?.popup}
            pushOffset={pushOffset}
            width={resolvedWidth}
          >
            <DrawerPushProvider value={childValue}>
              {showHeader ? (
                <DrawerHeader className={classNames?.header} style={semanticStyles?.header}>
                  <div className={styles.containerInner} style={containerStyle}>
                    {showTitle ? (
                      <DrawerTitle className={classNames?.title} style={semanticStyles?.title}>
                        {title}
                      </DrawerTitle>
                    ) : (
                      <span />
                    )}
                    {extraNode}
                  </div>
                </DrawerHeader>
              ) : (
                extraNode
              )}
              <DrawerContent
                className={cx(hasSidebar && styles.contentSidebar, classNames?.content)}
                style={semanticStyles?.content}
              >
                <div
                  style={{ ...containerStyle, ...semanticStyles?.bodyContent }}
                  className={cx(
                    styles.bodyContent,
                    hasSidebar && styles.bodyContentSidebar,
                    classNames?.bodyContent,
                  )}
                >
                  {bodyNode}
                </div>
              </DrawerContent>
              {footer && (
                <DrawerFooter className={classNames?.footer} style={semanticStyles?.footer}>
                  <div
                    className={cx(styles.containerInner, styles.containerInnerFooter)}
                    style={containerStyle}
                  >
                    {footer}
                  </div>
                </DrawerFooter>
              )}
            </DrawerPushProvider>
          </DrawerPopup>
        </DrawerPortal>
      </DrawerRoot>
    );
  },
);

Drawer.displayName = 'Drawer';

export default Drawer;
