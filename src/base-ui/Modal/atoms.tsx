'use client';

import { Dialog } from '@base-ui/react/dialog';
import { mergeProps } from '@base-ui/react/merge-props';
import { cx } from 'antd-style';
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
import { mergeRefs } from 'react-merge-refs';

import { useNativeButton } from '@/hooks/useNativeButton';
import { useMotionComponent } from '@/MotionProvider';
import { useAppElement } from '@/ThemeProvider';

import { backdropTransition, modalMotionConfig } from './constants';
import { styles } from './style';

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => cx(base, className(state));
  return cx(base, className);
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
};

const AnimatedModalRoot = ({
  open,
  children,
  onExitComplete: onExitCompleteProp,
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

  if (!isPresent) return null;

  return (
    <ModalOpenContext value={open}>
      <ModalActionsContext value={actions}>
        <Dialog.Root modal open {...rest}>
          {children}
        </Dialog.Root>
      </ModalActionsContext>
    </ModalOpenContext>
  );
};

export const ModalRoot = ({ open, onExitComplete, ...rest }: ModalRootProps) => {
  if (open !== undefined) {
    return <AnimatedModalRoot open={open} onExitComplete={onExitComplete} {...rest} />;
  }
  return <Dialog.Root modal {...rest} />;
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
  const Motion = useMotionComponent();

  if (open !== null) {
    return (
      <Motion.div
        animate={{ opacity: open ? 1 : 0 }}
        className={cx(styles.backdrop, className as string)}
        initial={{ opacity: 0 }}
        style={{ ...style, transition: 'none' }}
        transition={backdropTransition}
      />
    );
  }

  return (
    <Dialog.Backdrop
      {...rest}
      className={mergeStateClassName(styles.backdrop, className as any) as any}
      style={style}
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
export const ModalPopup = ({
  className,
  children,
  width,
  style,
  motionProps,
  panelClassName,
  popupStyle,
  ...rest
}: ModalPopupProps) => {
  const open = useModalOpen();
  const actions = useModalActions();
  const Motion = useMotionComponent();

  if (open !== null && actions) {
    return (
      <Dialog.Popup {...rest} className={cx(styles.popup, className as string)} style={popupStyle}>
        <AnimatePresence onExitComplete={actions.onExitComplete}>
          {open ? (
            <Motion.div
              {...modalMotionConfig}
              {...motionProps}
              className={cx(styles.popupInner, panelClassName)}
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
      className={mergeStateClassName(styles.popup, className as any) as any}
      style={popupStyle}
    >
      <div
        className={cx(styles.popupInner, panelClassName)}
        style={{ maxWidth: width ?? undefined, ...style }}
      >
        {children}
      </div>
    </Dialog.Popup>
  );
};

// --- Header ---
export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const ModalHeader = ({ className, ...rest }: ModalHeaderProps) => (
  <div {...rest} className={cx(styles.header, className)} />
);

// --- Title ---
export type ModalTitleProps = React.ComponentProps<typeof Dialog.Title>;
export const ModalTitle = ({ className, ...rest }: ModalTitleProps) => (
  <Dialog.Title {...rest} className={mergeStateClassName(styles.title, className as any) as any} />
);

// --- Description ---
export type ModalDescriptionProps = React.ComponentProps<typeof Dialog.Description>;
export const ModalDescription: React.FC<ModalDescriptionProps> = Dialog.Description;

// --- Content ---
export type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const ModalContent = ({ className, ...rest }: ModalContentProps) => (
  <div {...rest} className={cx(styles.content, className)} />
);

// --- Footer ---
export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const ModalFooter = ({ className, ...rest }: ModalFooterProps) => (
  <div {...rest} className={cx(styles.footer, className)} />
);

// --- Close ---
export type ModalCloseProps = React.ComponentProps<typeof Dialog.Close>;
export const ModalClose = ({ className, children, ...rest }: ModalCloseProps) => (
  <Dialog.Close {...rest} className={mergeStateClassName(styles.close, className as any) as any}>
    {children ?? <X size={18} />}
  </Dialog.Close>
);

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
