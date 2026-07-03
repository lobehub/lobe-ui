'use client';

import { cx } from 'antd-style';
import { X } from 'lucide-react';
import type { MotionProps } from 'motion/react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { ModalRootProps } from '../Modal';
import {
  ModalBackdrop,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from '../Modal';
import { styles } from './style';
import type {
  FloatingPanelOffset,
  FloatingPanelPlacement,
  FloatingPanelProps,
  FloatingPanelResizeHandle,
  FloatingPanelSize,
} from './type';

const DEFAULT_MIN_HEIGHT = 180;
const DEFAULT_MIN_WIDTH = 320;

interface InternalFloatingPanelSize extends FloatingPanelSize {
  sourceHeight?: number | string;
  sourceWidth?: number | string;
}

const defaultMotionProps: MotionProps = {
  animate: { opacity: 1, scale: 1, x: 0, y: 0 },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
    y: 12,
  },
  initial: { opacity: 0, scale: 0.98, y: 12 },
  transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
};

const topMotionProps: MotionProps = {
  animate: { opacity: 1, scale: 1, x: 0, y: 0 },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
    y: -12,
  },
  initial: { opacity: 0, scale: 0.98, y: -12 },
  transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
};

const resolveOffset = (offset: FloatingPanelOffset) => {
  if (typeof offset === 'object') {
    return {
      x: offset.x ?? 8,
      y: offset.y ?? 8,
    };
  }

  return { x: offset, y: offset };
};

const getPlacementStyle = (
  placement: FloatingPanelPlacement,
  offset: FloatingPanelOffset,
): CSSProperties => {
  const { x, y } = resolveOffset(offset);
  const isTop = placement.startsWith('top');
  const isLeft = placement.endsWith('Left');

  return {
    alignItems: isTop ? 'flex-start' : 'flex-end',
    justifyContent: isLeft ? 'flex-start' : 'flex-end',
    paddingBlockEnd: isTop ? undefined : y,
    paddingBlockStart: isTop ? y : undefined,
    paddingInlineEnd: isLeft ? undefined : x,
    paddingInlineStart: isLeft ? x : undefined,
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getViewportMaxSize = () => ({
  height: Math.max(DEFAULT_MIN_HEIGHT, window.innerHeight - 16),
  width: Math.max(DEFAULT_MIN_WIDTH, window.innerWidth - 16),
});

const getResizeHandles = (placement: FloatingPanelPlacement): FloatingPanelResizeHandle[] => {
  switch (placement) {
    case 'bottomLeft': {
      return ['top', 'right', 'topRight'];
    }
    case 'topLeft': {
      return ['bottom', 'right', 'bottomRight'];
    }
    case 'topRight': {
      return ['bottom', 'left', 'bottomLeft'];
    }
    default: {
      return ['top', 'left', 'topLeft'];
    }
  }
};

const getResizeHandleClassName = (s: typeof styles, handle: FloatingPanelResizeHandle) => {
  const handleClassMap: Record<FloatingPanelResizeHandle, string> = {
    bottom: s.resizeHandleBottom,
    bottomLeft: s.resizeHandleBottomLeft,
    bottomRight: s.resizeHandleBottomRight,
    left: s.resizeHandleLeft,
    right: s.resizeHandleRight,
    top: s.resizeHandleTop,
    topLeft: s.resizeHandleTopLeft,
    topRight: s.resizeHandleTopRight,
  };

  return handleClassMap[handle];
};

const resolveResizeSize = ({
  handle,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  startHeight,
  startWidth,
  startX,
  startY,
  x,
  y,
}: {
  handle: FloatingPanelResizeHandle;
  maxHeight: number;
  maxWidth: number;
  minHeight: number;
  minWidth: number;
  startHeight: number;
  startWidth: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
}): FloatingPanelSize => {
  const deltaX = x - startX;
  const deltaY = y - startY;
  const growsLeft = handle.includes('Left') || handle === 'left';
  const growsRight = handle.includes('Right') || handle === 'right';
  const growsTop = handle.includes('top') || handle === 'top';
  const growsBottom = handle.includes('bottom') || handle === 'bottom';

  const nextWidth = growsLeft ? startWidth - deltaX : growsRight ? startWidth + deltaX : startWidth;
  const nextHeight = growsTop
    ? startHeight - deltaY
    : growsBottom
      ? startHeight + deltaY
      : startHeight;

  return {
    height: clamp(nextHeight, minHeight, maxHeight),
    width: clamp(nextWidth, minWidth, maxWidth),
  };
};

const FloatingPanel = memo<FloatingPanelProps>(
  ({
    afterClose,
    ariaLabel,
    children,
    className,
    classNames,
    closable = true,
    closeIcon,
    closeLabel = 'Close',
    defaultOpen,
    actions,
    footer,
    getContainer,
    height,
    keyboard = true,
    mask = false,
    maskClosable = true,
    maxHeight,
    maxWidth,
    minHeight = DEFAULT_MIN_HEIGHT,
    minWidth = DEFAULT_MIN_WIDTH,
    modal = false,
    motionProps,
    offset = 8,
    onClose,
    onOpenChange,
    onResize,
    onResizeEnd,
    open,
    placement = 'bottomRight',
    resizable = true,
    styles: semanticStyles,
    title,
    width = 640,
    zIndex,
  }) => {
    const s = styles;
    const isTop = placement.startsWith('top');
    const container = getContainer === false ? undefined : getContainer;
    const [resizeSize, setResizeSize] = useState<InternalFloatingPanelSize>();
    const latestResizeSizeRef = useRef<FloatingPanelSize | undefined>(undefined);
    const resizeCleanupRef = useRef<(() => void) | undefined>(undefined);
    const activeResizeSize =
      resizeSize?.sourceWidth === width && resizeSize.sourceHeight === height
        ? resizeSize
        : undefined;

    useEffect(
      () => () => {
        resizeCleanupRef.current?.();
      },
      [],
    );

    const popupStyle = useMemo(
      () => ({
        ...getPlacementStyle(placement, offset),
        ...semanticStyles?.wrapper,
      }),
      [offset, placement, semanticStyles?.wrapper],
    );

    const handleOpenChange = useCallback<NonNullable<ModalRootProps['onOpenChange']>>(
      (nextOpen, eventDetails) => {
        if (!nextOpen) {
          if (keyboard === false && eventDetails.reason === 'escape-key') return;
          if (maskClosable === false && eventDetails.reason === 'outside-press') return;
          onClose?.();
        }

        onOpenChange?.(nextOpen, eventDetails);
      },
      [keyboard, maskClosable, onClose, onOpenChange],
    );

    const showHeader = title !== undefined || actions !== undefined || closable;
    const resolvedMotionProps = motionProps ?? (isTop ? topMotionProps : defaultMotionProps);
    const resizeHandles = useMemo(() => getResizeHandles(placement), [placement]);

    const handleResizeStart = useCallback(
      (handle: FloatingPanelResizeHandle) => (event: ReactPointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const panel = event.currentTarget.parentElement;
        if (!panel) return;

        const rect = panel.getBoundingClientRect();
        const viewportMaxSize = getViewportMaxSize();
        const resolvedMaxWidth = Math.max(minWidth, maxWidth ?? viewportMaxSize.width);
        const resolvedMaxHeight = Math.max(minHeight, maxHeight ?? viewportMaxSize.height);
        const startX = event.clientX;
        const startY = event.clientY;

        const handleResizeMove = (moveEvent: PointerEvent) => {
          const nextSize = resolveResizeSize({
            handle,
            maxHeight: resolvedMaxHeight,
            maxWidth: resolvedMaxWidth,
            minHeight,
            minWidth,
            startHeight: rect.height,
            startWidth: rect.width,
            startX,
            startY,
            x: moveEvent.clientX,
            y: moveEvent.clientY,
          });

          const nextState = { ...nextSize, sourceHeight: height, sourceWidth: width };
          latestResizeSizeRef.current = nextSize;
          setResizeSize(nextState);
          onResize?.(nextSize);
        };

        const handleResizeEnd = () => {
          resizeCleanupRef.current?.();
          resizeCleanupRef.current = undefined;

          if (latestResizeSizeRef.current) onResizeEnd?.(latestResizeSizeRef.current);
        };

        resizeCleanupRef.current?.();
        window.addEventListener('pointermove', handleResizeMove);
        window.addEventListener('pointerup', handleResizeEnd);
        resizeCleanupRef.current = () => {
          window.removeEventListener('pointermove', handleResizeMove);
          window.removeEventListener('pointerup', handleResizeEnd);
        };
      },
      [height, maxHeight, maxWidth, minHeight, minWidth, onResize, onResizeEnd, width],
    );

    return (
      <ModalRoot
        defaultOpen={defaultOpen}
        modal={modal}
        open={open}
        zIndex={zIndex}
        onExitComplete={afterClose}
        onOpenChange={handleOpenChange}
      >
        <ModalPortal container={container}>
          {mask && (
            <ModalBackdrop className={classNames?.backdrop} style={semanticStyles?.backdrop} />
          )}
          <ModalPopup
            aria-label={ariaLabel}
            className={cx(s.wrapper, classNames?.wrapper)}
            motionProps={resolvedMotionProps}
            panelClassName={cx(s.panel, isTop && s.panelTop, className, classNames?.panel)}
            popupStyle={popupStyle}
            width={activeResizeSize?.width ?? width}
            style={{
              height: activeResizeSize?.height ?? height,
              minHeight,
              minWidth,
              width: activeResizeSize?.width,
              ...semanticStyles?.panel,
            }}
          >
            {resizable &&
              resizeHandles.map((handle) => (
                <div
                  aria-hidden
                  data-floating-panel-resize-handle={handle}
                  key={handle}
                  style={semanticStyles?.resizeHandle}
                  className={cx(
                    s.resizeHandle,
                    getResizeHandleClassName(s, handle),
                    classNames?.resizeHandle,
                  )}
                  onPointerDown={handleResizeStart(handle)}
                />
              ))}
            {showHeader && (
              <ModalHeader
                className={cx(s.header, classNames?.header)}
                style={semanticStyles?.header}
              >
                {title !== undefined ? (
                  <ModalTitle
                    className={cx(s.title, classNames?.title)}
                    style={semanticStyles?.title}
                  >
                    {title}
                  </ModalTitle>
                ) : (
                  <span />
                )}
                <div className={s.headerActions}>
                  {actions && (
                    <div
                      className={cx(s.actions, classNames?.actions)}
                      style={semanticStyles?.actions}
                    >
                      {actions}
                    </div>
                  )}
                  {closable && (
                    <ModalClose
                      aria-label={closeLabel}
                      className={cx(s.close, classNames?.close)}
                      style={semanticStyles?.close}
                    >
                      {closeIcon ?? <X size={16} />}
                    </ModalClose>
                  )}
                </div>
              </ModalHeader>
            )}
            <ModalContent className={cx(s.body, classNames?.body)} style={semanticStyles?.body}>
              {children}
            </ModalContent>
            {footer && (
              <ModalFooter
                className={cx(s.footer, classNames?.footer)}
                style={semanticStyles?.footer}
              >
                {footer}
              </ModalFooter>
            )}
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>
    );
  },
);

FloatingPanel.displayName = 'FloatingPanel';

export { FloatingPanel };
