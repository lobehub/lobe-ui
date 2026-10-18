'use client';

import { Maximize2, Minimize2, X } from 'lucide-react';
import { useDragControls } from 'motion/react';
import type { MouseEvent, PointerEvent } from 'react';
import type React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';
import { stopPropagation } from '@/utils/dom';

import { Button } from '../Button';
import {
  ModalBackdrop,
  ModalContentImpl,
  ModalFooter,
  ModalHeaderImpl,
  ModalPopupImpl,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from './atoms';
import { modalClasses } from './stable';
import { styles } from './style';
import type { ModalComponentProps } from './type';

interface OkBtnProps {
  confirmLoading?: boolean;
  okButtonProps?: ModalComponentProps['okButtonProps'];
  okText?: React.ReactNode;
  onOk: (e: MouseEvent<HTMLButtonElement>) => void;
}

const OkBtn: React.FC<OkBtnProps> = ({ confirmLoading, okButtonProps, okText, onOk }) => {
  const { onClick: userOnClick, ...restOk } = okButtonProps ?? {};
  return (
    <Button
      loading={confirmLoading}
      type="primary"
      {...restOk}
      onClick={(e) => {
        onOk(e as MouseEvent<HTMLButtonElement>);
        userOnClick?.(e as never);
      }}
    >
      {okText}
    </Button>
  );
};
interface CancelBtnProps {
  cancelButtonProps?: ModalComponentProps['cancelButtonProps'];
  cancelText?: React.ReactNode;
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void;
}

const CancelBtn: React.FC<CancelBtnProps> = ({ cancelButtonProps, cancelText, onCancel }) => {
  const { onClick: userOnClick, ...restCancel } = cancelButtonProps ?? {};
  return (
    <Button
      {...restCancel}
      onClick={(e) => {
        onCancel(e as MouseEvent<HTMLButtonElement>);
        userOnClick?.(e as never);
      }}
    >
      {cancelText}
    </Button>
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
      denyTimerRef.current = setTimeout(() => setIsDenying(false), 300);
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
        return footer(defaultFooter, { CancelBtn: () => cancelBtnNode, OkBtn: () => okBtnNode });
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
    const dataAttributes = toDataAttributes({ draggable: shouldDrag, fullscreen: isFullscreen });
    const panelStyle: React.CSSProperties = {
      ...(hasHeight && !isFullscreen ? { height } : {}),
      ...style,
    };

    return (
      <ModalRoot
        open={open ?? false}
        zIndex={zIndex}
        onExitComplete={handleExitComplete}
        onOpenChange={handleOpenChange}
      >
        <ModalPortal container={container}>
          {mask && (
            <ModalBackdrop
              className={classNames?.mask}
              style={semanticStyles?.mask}
              {...dataAttributes}
            />
          )}
          <ModalPopupImpl
            className={classNames?.wrapper}
            panelClassName={className}
            panelData={dataAttributes}
            {...dataAttributes}
            popupStyle={semanticStyles?.wrapper}
            ref={constraintsRef}
            style={panelStyle}
            width={isFullscreen ? undefined : width}
            motionProps={{
              ...dragProps,
              onAnimationComplete: handleAnimationComplete,
            }}
            panelXstyle={[
              isFullscreen && styles.fullscreenPopupInner,
              isDenying && styles.denyAnimation,
            ]}
          >
            {showHeader && (
              <ModalHeaderImpl
                className={classNames?.header}
                xstyle={shouldDrag && styles.headerDraggable}
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
                <div
                  {...styleProps(styles.headerActions, modalClasses('header-actions'))}
                  onPointerDown={stopPropagation}
                >
                  {allowFullscreen && (
                    <button
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                      {...styleProps(
                        [styles.fullscreenToggle, focusRing.info],
                        modalClasses('fullscreen-toggle'),
                      )}
                      type="button"
                      onClick={() => setIsFullscreen((prev) => !prev)}
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  )}
                  {closable && (
                    <button
                      aria-label="Close"
                      {...styleProps([styles.closeInline, focusRing.info], modalClasses('close'))}
                      type="button"
                      onClick={handleCancel}
                    >
                      {closeIcon ?? <X size={16} />}
                    </button>
                  )}
                </div>
              </ModalHeaderImpl>
            )}
            <ModalContentImpl
              className={classNames?.body}
              xstyle={!showHeader && styles.contentNoHeader}
              style={{
                ...(hasHeight || isFullscreen ? { flex: 1 } : {}),
                ...semanticStyles?.body,
              }}
            >
              {loading ? (
                <div {...styleProps(styles.loading, modalClasses('loading'))}>
                  <span {...styleProps([styles.loadingSpinner, styles.loadingSpinnerLarge])} />
                </div>
              ) : (
                children
              )}
            </ModalContentImpl>
            {footerNode !== null && (
              <ModalFooter className={classNames?.footer} style={semanticStyles?.footer}>
                {footerNode}
              </ModalFooter>
            )}
          </ModalPopupImpl>
        </ModalPortal>
      </ModalRoot>
    );
  },
);

Modal.displayName = 'Modal';

export default Modal;
