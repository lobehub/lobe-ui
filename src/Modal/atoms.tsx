'use client';

import { Dialog } from '@base-ui/react/dialog';
import { mergeProps } from '@base-ui/react/merge-props';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import type React from 'react';
import {
  cloneElement,
  createContext,
  isValidElement,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { mergeRefs, useMergeRefs } from 'react-merge-refs';

import { useAppElement } from '@/ConfigProvider/AppElementContext';
import { useNativeButton } from '@/hooks/useNativeButton';
import { useMotionComponent } from '@/MotionProvider';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { useLayerZIndex } from '../internal/zIndex';
import { backdropTransition, modalMotionConfig } from './constants';
import { ModalLayerProvider, useModalLayer } from './ModalLayerContext';
import { styles } from './style';

type XStyle = Parameters<typeof styleProps>[0];

const mergeStateClassName = <TState,>(
  xstyle: XStyle,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  const base = stylex.props(xstyle).className;
  if (typeof className === 'function') return (state: TState) => clsx(base, className(state));
  return clsx(base, className);
};

// --- Animation Contexts (granular to minimize re-renders) ---

// State: open boolean, null = non-animated mode
const ModalOpenContext = createContext<boolean | null>(null);

// Actions: stable callbacks, null = non-animated mode
interface ModalAnimationActions {
  onExitComplete: () => void;
}
const ModalActionsContext = createContext<ModalAnimationActions | null>(null);

export const useModalOpen = () => use(ModalOpenContext);
export const useModalActions = () => use(ModalActionsContext);

// --- Root ---
export type ModalRootProps = Dialog.Root.Props & {
  onExitComplete?: () => void;
  zIndex?: number;
};

const AnimatedModalRoot = ({
  open,
  children,
  onExitComplete: onExitCompleteProp,
  zIndex: explicitZIndex,
  ...rest
}: Omit<ModalRootProps, 'open'> & { open: boolean }) => {
  const [isPresent, setIsPresent] = useState(!!open);

  useEffect(() => {
    if (open) setIsPresent(true);
  }, [open]);

  const handleExitComplete = useCallback(() => {
    setIsPresent(false);
    onExitCompleteProp?.();
  }, [onExitCompleteProp]);

  const actions = useMemo(() => ({ onExitComplete: handleExitComplete }), [handleExitComplete]);

  const { zIndex, ref: popupRef } = useLayerZIndex<HTMLDivElement>('modal', explicitZIndex);
  const layer = useMemo(
    () => ({ popupRef: popupRef as (node: HTMLElement | null) => void, zIndex }),
    [zIndex, popupRef],
  );

  if (!isPresent) return null;

  return (
    <ModalOpenContext value={open}>
      <ModalActionsContext value={actions}>
        <ModalLayerProvider value={layer}>
          <Dialog.Root modal open {...rest}>
            {children}
          </Dialog.Root>
        </ModalLayerProvider>
      </ModalActionsContext>
    </ModalOpenContext>
  );
};

const NonAnimatedModalRoot = ({ zIndex: explicitZIndex, children, ...rest }: ModalRootProps) => {
  const { zIndex, ref: popupRef } = useLayerZIndex<HTMLDivElement>('modal', explicitZIndex);
  const layer = useMemo(
    () => ({ popupRef: popupRef as (node: HTMLElement | null) => void, zIndex }),
    [zIndex, popupRef],
  );
  return (
    <ModalLayerProvider value={layer}>
      <Dialog.Root modal {...rest}>
        {children}
      </Dialog.Root>
    </ModalLayerProvider>
  );
};

export const ModalRoot = ({ open, onExitComplete, ...rest }: ModalRootProps) => {
  if (open !== undefined) {
    return <AnimatedModalRoot open={open} onExitComplete={onExitComplete} {...rest} />;
  }
  return <NonAnimatedModalRoot {...rest} />;
};

// --- Portal ---
export type ModalPortalProps = React.ComponentProps<typeof Dialog.Portal> & {
  container?: HTMLElement | null;
};
export const ModalPortal = ({ container, ...rest }: ModalPortalProps) => {
  const appElement = useAppElement();
  return <Dialog.Portal container={container ?? appElement ?? undefined} {...rest} />;
};

// --- Viewport ---
export type ModalViewportProps = React.ComponentProps<typeof Dialog.Viewport>;
export const ModalViewport = ({ className, ...rest }: ModalViewportProps) => (
  <Dialog.Viewport
    {...rest}
    className={mergeStateClassName(styles.viewport, className as any) as any}
  />
);

// --- Backdrop ---
export type ModalBackdropProps = React.ComponentProps<typeof Dialog.Backdrop>;
export const ModalBackdrop = ({ className, style, ...rest }: ModalBackdropProps) => {
  const open = useModalOpen();
  const layer = useModalLayer();
  const Motion = useMotionComponent();
  const layerStyle = layer?.zIndex !== undefined ? { zIndex: layer.zIndex } : undefined;

  if (open !== null) {
    return (
      <Dialog.Backdrop
        {...rest}
        className={clsx(stylex.props(styles.backdrop).className, className as string)}
        style={{ ...layerStyle, ...style, transition: 'none' }}
        render={
          <Motion.div
            animate={{ opacity: open ? 1 : 0 }}
            initial={{ opacity: 0 }}
            transition={backdropTransition}
          />
        }
      />
    );
  }

  return (
    <Dialog.Backdrop
      {...rest}
      className={mergeStateClassName(styles.backdrop, className as any) as any}
      style={{ ...layerStyle, ...style }}
    />
  );
};

// --- Popup ---
export type ModalPopupProps = React.ComponentProps<typeof Dialog.Popup> & {
  motionProps?: Record<string, any>;
  panelClassName?: string;
  popupStyle?: React.CSSProperties;
  width?: number | string;
};
export const ModalPopupImpl = ({
  className,
  children,
  width,
  style,
  motionProps,
  panelClassName,
  panelXstyle,
  popupStyle,
  ref: forwardedRef,
  xstyle,
  ...rest
}: ModalPopupProps & { panelXstyle?: XStyle; xstyle?: XStyle }) => {
  const open = useModalOpen();
  const actions = useModalActions();
  const layer = useModalLayer();
  const Motion = useMotionComponent();
  const popupZIndexStyle = layer?.zIndex !== undefined ? { zIndex: layer.zIndex + 1 } : undefined;
  const composedRef = useMergeRefs([forwardedRef, layer?.popupRef]);

  if (open !== null && actions) {
    return (
      <Dialog.Popup
        {...rest}
        className={clsx(stylex.props(styles.popup, xstyle).className, className as string)}
        ref={composedRef as any}
        style={{ ...popupZIndexStyle, ...popupStyle }}
      >
        <AnimatePresence onExitComplete={actions.onExitComplete}>
          {open ? (
            <Motion.div
              {...modalMotionConfig}
              {...motionProps}
              className={clsx(stylex.props(styles.popupInner, panelXstyle).className, panelClassName)}
              key="modal-popup-panel"
              style={{ maxWidth: width ?? undefined, transition: 'none', ...style }}
            >
              {children}
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </Dialog.Popup>
    );
  }

  return (
    <Dialog.Popup
      {...rest}
      className={mergeStateClassName([styles.popup, xstyle], className as any) as any}
      ref={composedRef as any}
      style={{ ...popupZIndexStyle, ...popupStyle }}
    >
      <div
        {...styleProps([styles.popupInner, panelXstyle], panelClassName, {
          maxWidth: width ?? undefined,
          ...style,
        })}
      >
        {children}
      </div>
    </Dialog.Popup>
  );
};

export const ModalPopup: React.FC<ModalPopupProps> = ModalPopupImpl;

// --- Header ---
export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const ModalHeaderImpl = ({
  className,
  style,
  xstyle,
  ...rest
}: ModalHeaderProps & { xstyle?: XStyle }) => (
  <div {...rest} {...styleProps([styles.header, xstyle], className, style)} />
);
export const ModalHeader: React.FC<ModalHeaderProps> = ModalHeaderImpl;

// --- Title ---
export type ModalTitleProps = React.ComponentProps<typeof Dialog.Title>;
export const ModalTitleImpl = ({
  className,
  xstyle,
  ...rest
}: ModalTitleProps & { xstyle?: XStyle }) => (
  <Dialog.Title
    {...rest}
    className={mergeStateClassName([styles.title, xstyle], className as any) as any}
  />
);
export const ModalTitle: React.FC<ModalTitleProps> = ModalTitleImpl;

// --- Description ---
export type ModalDescriptionProps = React.ComponentProps<typeof Dialog.Description>;
export const ModalDescription: React.FC<ModalDescriptionProps> = Dialog.Description;

// --- Content ---
export type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const ModalContentImpl = ({
  className,
  style,
  xstyle,
  ...rest
}: ModalContentProps & { xstyle?: XStyle }) => (
  <div {...rest} {...styleProps([styles.content, xstyle], className, style)} />
);
export const ModalContent: React.FC<ModalContentProps> = ModalContentImpl;

// --- Footer ---
export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const ModalFooterImpl = ({
  className,
  style,
  xstyle,
  ...rest
}: ModalFooterProps & { xstyle?: XStyle }) => (
  <div {...rest} {...styleProps([styles.footer, xstyle], className, style)} />
);
export const ModalFooter: React.FC<ModalFooterProps> = ModalFooterImpl;

// --- Close ---
export type ModalCloseProps = React.ComponentProps<typeof Dialog.Close>;
export const ModalCloseImpl = ({
  className,
  children,
  xstyle,
  ...rest
}: ModalCloseProps & { xstyle?: XStyle }) => (
  <Dialog.Close
    {...rest}
    className={
      mergeStateClassName(
        [styles.closeInline, styles.close, focusRing.info, xstyle],
        className as any,
      ) as any
    }
  >
    {children ?? <X size={16} />}
  </Dialog.Close>
);
export const ModalClose: React.FC<ModalCloseProps> = ModalCloseImpl;

// --- Trigger ---
export type ModalTriggerProps = Omit<
  React.ComponentPropsWithRef<typeof Dialog.Trigger>,
  'children' | 'render'
> & {
  children?: React.ReactNode;
  nativeButton?: boolean;
};

export const ModalTrigger = ({
  children,
  className,
  nativeButton,
  ref: refProp,
  ...rest
}: ModalTriggerProps) => {
  const { isNativeButtonTriggerElement, resolvedNativeButton } = useNativeButton({
    children,
    nativeButton,
  });

  const renderer = (props: any) => {
    const resolvedProps = (() => {
      if (isNativeButtonTriggerElement) return props as any;
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { type, ...restProps } = props as any;
      return restProps;
    })();

    const mergedProps = mergeProps((children as any).props, resolvedProps);
    return cloneElement(children as any, {
      ...mergedProps,
      ref: mergeRefs([(children as any).ref, (props as any).ref, refProp]),
    });
  };

  if (isValidElement(children)) {
    return (
      <Dialog.Trigger
        {...rest}
        className={className}
        nativeButton={resolvedNativeButton}
        render={renderer as any}
      />
    );
  }

  return (
    <Dialog.Trigger
      {...rest}
      className={className}
      nativeButton={resolvedNativeButton}
      ref={refProp as any}
    >
      {children}
    </Dialog.Trigger>
  );
};
