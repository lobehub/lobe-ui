'use client';

import { cx, useTheme } from 'antd-style';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { useDragControls } from 'motion/react';
import type { MouseEvent, PointerEvent } from 'react';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { stopPropagation } from '@/utils/dom';
import { safeReadableColor } from '@/utils/safeReadableColor';

import {
  ModalBackdrop,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from './atoms';
import { styles } from './style';
import type { ModalComponentProps } from './type';
import { acquireModalZIndex } from './zIndexManager';

interface OkBtnProps {
  confirmLoading?: boolean;
  okButtonProps?: ModalComponentProps['okButtonProps'];
  okText?: React.ReactNode;
  onOk: (e: MouseEvent<HTMLButtonElement>) => void;
}

const OkBtn: React.FC<OkBtnProps> = ({ confirmLoading, okButtonProps, okText, onOk }) => {
  const theme = useTheme();
  const {
    className: userCls,
    danger,
    disabled: userDisabled,
    onClick: userOnClick,
    style: userStyle,
    ...restOk
  } = okButtonProps ?? {};
  const bgColor = danger ? theme.colorError : theme.colorPrimary;
  const textColor = safeReadableColor(bgColor);
  return (
    <button
      type="button"
      {...restOk}
      className={cx(styles.buttonBase, danger ? styles.dangerOkButton : styles.okButton, userCls)}
      disabled={confirmLoading || userDisabled}
      style={{ color: textColor, ...userStyle }}
      onClick={(e) => {
        onOk(e);
        userOnClick?.(e);
      }}
    >
      {confirmLoading && <span className={styles.loadingSpinner} />}
      {okText}
    </button>
  );
};
interface CancelBtnProps {
  cancelButtonProps?: ModalComponentProps['cancelButtonProps'];
  cancelText?: React.ReactNode;
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
}

const CancelBtn: React.FC<CancelBtnProps> = ({ cancelButtonProps, cancelText, onCancel }) => {
  const { className: userCls, onClick: userOnClick, ...restCancel } = cancelButtonProps ?? {};
  return (
    <button
      type="button"
      {...restCancel}
      className={cx(styles.buttonBase, styles.cancelButton, userCls)}
      onClick={(e) => {
        onCancel(e);
        userOnClick?.(e);
      }}
    >
      {cancelText}
    </button>
  );
};

const Modal = memo<ModalComponentProps>(
  ({
    open,
    title,
    children,
    onOk,
    onCancel,
    okText = 'OK',
    cancelText = 'Cancel',
    okButtonProps,
    cancelButtonProps,
    confirmLoading,
    footer,
    width,
    height,
    maskClosable = true,
    closable = true,
    closeIcon,
    className,
    style,
    classNames,
    styles: semanticStyles,
    zIndex,
    afterClose,
    afterOpenChange,
    loading,
    getContainer,
    mask = true,
    keyboard,
    draggable = true,
    allowFullscreen = false,
  }) => {
    const dragControls = useDragControls();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isDenying, setIsDenying] = useState(false);
    const denyTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(denyTimerRef.current), []);

    const triggerDeny = useCallback(() => {
      clearTimeout(denyTimerRef.current);
      setIsDenying(true);
      denyTimerRef.current = setTimeout(() => setIsDenying(false), 400);
    }, []);

    const handleOpenChange = useCallback(
      (nextOpen: boolean, eventDetails: { reason: string }) => {
        if (!open) return;
        if (!nextOpen && keyboard === false && eventDetails.reason === 'escape-key') return;
        if (!nextOpen && !maskClosable && eventDetails.reason === 'outside-press') {
          triggerDeny();
          return;
        }
        if (!nextOpen) {
          onCancel?.(new MouseEvent('click') as unknown as MouseEvent<HTMLButtonElement>);
        }
      },
      [onCancel, keyboard, maskClosable, open, triggerDeny],
    );

    const handleExitComplete = useCallback(() => {
      setIsFullscreen(false);
      afterClose?.();
      afterOpenChange?.(false);
    }, [afterClose, afterOpenChange]);

    const handleAnimationComplete = useCallback(() => {
      if (open) afterOpenChange?.(true);
    }, [open, afterOpenChange]);

    const handleDragStart = useCallback(
      (e: PointerEvent) => {
        if (draggable && !isFullscreen) {
          dragControls.start(e);
          setIsDragging(true);
        }
      },
      [draggable, dragControls, isFullscreen],
    );

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleOk = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onOk?.(e);
      },
      [onOk],
    );

    const handleCancel = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onCancel?.(e);
      },
      [onCancel],
    );

    const footerNode = useMemo(() => {
      if (footer === false || footer === null) return null;
      const cancelBtnNode = (
        <CancelBtn
          cancelButtonProps={cancelButtonProps}
          cancelText={cancelText}
          onCancel={handleCancel}
        />
      );
      const okBtnNode = (
        <OkBtn
          confirmLoading={confirmLoading}
          okButtonProps={okButtonProps}
          okText={okText}
          onOk={handleOk}
        />
      );
      const defaultFooter = (
        <>
          {cancelBtnNode}
          {okBtnNode}
        </>
      );

      if (typeof footer === 'function') {
        const BoundCancelBtn: React.FC = () => cancelBtnNode;
        const BoundOkBtn: React.FC = () => okBtnNode;
        return footer(defaultFooter, { CancelBtn: BoundCancelBtn, OkBtn: BoundOkBtn });
      }

      return footer ?? defaultFooter;
    }, [
      footer,
      cancelButtonProps,
      cancelText,
      handleCancel,
      confirmLoading,
      okButtonProps,
      okText,
      handleOk,
    ]);

    const container = getContainer === false ? undefined : (getContainer ?? undefined);

    const prevOpenRef = useRef(false);
    const acquiredZRef = useRef<number | undefined>(undefined);
    if (open && !prevOpenRef.current) {
      acquiredZRef.current = acquireModalZIndex();
    }
    prevOpenRef.current = !!open;
    const effectiveZIndex = zIndex ?? acquiredZRef.current;
    const backdropZIndex = effectiveZIndex ? { zIndex: effectiveZIndex } : undefined;
    const popupZIndex = effectiveZIndex ? { zIndex: effectiveZIndex + 1 } : undefined;

    const shouldDrag = draggable && !isFullscreen;
    const dragProps = shouldDrag
      ? {
          drag: true as const,
          dragConstraints: constraintsRef,
          dragControls,
          dragElastic: 0,
          dragListener: false,
          dragMomentum: false,
          whileDrag: { cursor: 'grabbing' as const },
        }
      : {};

    const showTitle = title !== undefined && title !== false && title !== null;
    const showHeader = showTitle || closable || allowFullscreen;

    const hasHeight = height !== undefined;
    const panelStyle: React.CSSProperties = {
      ...(hasHeight && !isFullscreen ? { height } : {}),
      ...style,
    };

    return (
      <ModalRoot
        open={open ?? false}
        onExitComplete={handleExitComplete}
        onOpenChange={handleOpenChange}
      >
        <ModalPortal container={container}>
          {mask && (
            <ModalBackdrop
              className={classNames?.mask}
              style={{ ...backdropZIndex, ...semanticStyles?.mask }}
            />
          )}
          <ModalPopup
            className={classNames?.wrapper}
            popupStyle={{ ...popupZIndex, ...semanticStyles?.wrapper }}
            ref={constraintsRef}
            style={panelStyle}
            width={isFullscreen ? undefined : width}
            motionProps={{
              ...dragProps,
              onAnimationComplete: handleAnimationComplete,
            }}
            panelClassName={cx(
              className,
              isFullscreen && styles.fullscreenPopupInner,
              isDenying && styles.denyAnimation,
            )}
          >
            {showHeader && (
              <ModalHeader
                className={cx(classNames?.header, shouldDrag && styles.headerDraggable)}
                style={{
                  ...(isDragging ? { cursor: 'grabbing' } : {}),
                  ...semanticStyles?.header,
                }}
                onPointerCancel={handleDragEnd}
                onPointerDown={handleDragStart}
                onPointerUp={handleDragEnd}
              >
                {showTitle ? (
                  <ModalTitle className={classNames?.title} style={semanticStyles?.title}>
                    {title}
                  </ModalTitle>
                ) : (
                  <span />
                )}
                <div className={styles.headerActions} onPointerDown={stopPropagation}>
                  {allowFullscreen && (
                    <button
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                      className={styles.fullscreenToggle}
                      type="button"
                      onClick={() => setIsFullscreen((prev) => !prev)}
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  )}
                  {closable && (
                    <button
                      aria-label="Close"
                      className={styles.closeInline}
                      type="button"
                      onClick={handleCancel}
                    >
                      {closeIcon ?? <X size={18} />}
                    </button>
                  )}
                </div>
              </ModalHeader>
            )}
            <ModalContent
              className={classNames?.body}
              style={{
                ...(hasHeight || isFullscreen ? { flex: 1 } : {}),
                ...semanticStyles?.body,
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '32px 0',
                  }}
                >
                  <span className={styles.loadingSpinner} style={{ height: 24, width: 24 }} />
                </div>
              ) : (
                children
              )}
            </ModalContent>
            {footerNode !== null && (
              <ModalFooter className={classNames?.footer} style={semanticStyles?.footer}>
                {footerNode}
              </ModalFooter>
            )}
          </ModalPopup>
        </ModalPortal>
      </ModalRoot>
    );
  },
);

Modal.displayName = 'Modal';

export default Modal;
