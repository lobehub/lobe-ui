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
  useRef,
  useState,
} from 'react';
import { mergeRefs, useMergeRefs } from 'react-merge-refs';

import { useAppElement } from '@/ConfigProvider/AppElementContext';
import { useNativeButton } from '@/hooks/useNativeButton';
import { useMotionComponent } from '@/MotionProvider';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { useLayerZIndex } from '../internal/zIndex';
import { drawerBackdropTransition, getDrawerMotionConfig, pushAxis } from './constants';
import { DrawerLayerProvider, useDrawerLayer } from './DrawerLayerContext';
import { styles } from './style';
import type { DrawerPlacement } from './type';

type XStyle = Parameters<typeof styleProps>[0];

const mergeStateClassName = <TState,>(
  xstyle: XStyle,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  const base = stylex.props(xstyle).className;
  if (typeof className === 'function') return (state: TState) => clsx(base, className(state));
  return clsx(base, className);
};

const popupPlacementClass = {
  bottom: styles.popupBottom,
  left: styles.popupLeft,
  right: styles.popupRight,
  top: styles.popupTop,
};

const panelPlacementClass = {
  bottom: styles.panelBottom,
  left: styles.panelLeft,
  right: styles.panelRight,
  top: styles.panelTop,
};

const panelRoundedClass = {
  bottom: styles.panelRoundedBottom,
  left: styles.panelRoundedLeft,
  right: styles.panelRoundedRight,
  top: styles.panelRoundedTop,
};

const DrawerOpenContext = createContext<boolean | null>(null);

interface DrawerAnimationActions {
  onExitComplete: () => void;
}
const DrawerActionsContext = createContext<DrawerAnimationActions | null>(null);

export const useDrawerOpen = () => use(DrawerOpenContext);
export const useDrawerActions = () => use(DrawerActionsContext);

export type DrawerRootProps = Dialog.Root.Props & {
  onExitComplete?: () => void;
  zIndex?: number;
};

const AnimatedDrawerRoot = ({
  open,
  children,
  onExitComplete: onExitCompleteProp,
  zIndex: explicitZIndex,
  ...rest
}: Omit<DrawerRootProps, 'open'> & { open: boolean }) => {
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
    <DrawerOpenContext value={open}>
      <DrawerActionsContext value={actions}>
        <DrawerLayerProvider value={layer}>
          <Dialog.Root modal open {...rest}>
            {children}
          </Dialog.Root>
        </DrawerLayerProvider>
      </DrawerActionsContext>
    </DrawerOpenContext>
  );
};

const NonAnimatedDrawerRoot = ({ zIndex: explicitZIndex, children, ...rest }: DrawerRootProps) => {
  const { zIndex, ref: popupRef } = useLayerZIndex<HTMLDivElement>('modal', explicitZIndex);
  const layer = useMemo(
    () => ({ popupRef: popupRef as (node: HTMLElement | null) => void, zIndex }),
    [zIndex, popupRef],
  );

  return (
    <DrawerLayerProvider value={layer}>
      <Dialog.Root modal {...rest}>
        {children}
      </Dialog.Root>
    </DrawerLayerProvider>
  );
};

export const DrawerRoot = ({ open, onExitComplete, ...rest }: DrawerRootProps) => {
  if (open !== undefined) {
    return <AnimatedDrawerRoot open={open} onExitComplete={onExitComplete} {...rest} />;
  }
  return <NonAnimatedDrawerRoot {...rest} />;
};

export type DrawerPortalProps = React.ComponentProps<typeof Dialog.Portal> & {
  container?: HTMLElement | null;
};
export const DrawerPortal = ({ container, ...rest }: DrawerPortalProps) => {
  const appElement = useAppElement();
  return <Dialog.Portal container={container ?? appElement ?? undefined} {...rest} />;
};

export type DrawerBackdropProps = React.ComponentProps<typeof Dialog.Backdrop>;
export const DrawerBackdrop = ({ className, style, ...rest }: DrawerBackdropProps) => {
  const open = useDrawerOpen();
  const layer = useDrawerLayer();
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
            transition={drawerBackdropTransition}
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

export type DrawerPopupProps = React.ComponentProps<typeof Dialog.Popup> & {
  flush?: boolean;
  height?: number | string;
  motionProps?: Record<string, any>;
  panelClassName?: string;
  panelStyle?: React.CSSProperties;
  placement?: DrawerPlacement;
  popupStyle?: React.CSSProperties;
  pushOffset?: number;
  width?: number | string;
};

export const DrawerPopupImpl = ({
  className,
  children,
  placement: placementProp = 'right',
  width: widthProp,
  height: heightProp,
  flush,
  pushOffset = 0,
  motionProps,
  panelClassName,
  panelStyle,
  panelXstyle,
  popupStyle,
  ref: forwardedRef,
  ...rest
}: DrawerPopupProps & { panelXstyle?: XStyle }) => {
  const open = useDrawerOpen();
  const actions = useDrawerActions();
  const layer = useDrawerLayer();
  const Motion = useMotionComponent();
  const composedRef = useMergeRefs([forwardedRef, layer?.popupRef]);

  // The exiting panel lives inside AnimatePresence and keeps the props it had while open,
  // but this popup re-renders with whatever the consumer passes now. Freezing the geometry
  // during exit keeps the two in sync — otherwise a placement change on close teleports the
  // popup to the new edge while the panel animates out along the old axis.
  const openGeometryRef = useRef({
    height: heightProp,
    placement: placementProp,
    width: widthProp,
  });
  if (open !== false) {
    openGeometryRef.current = { height: heightProp, placement: placementProp, width: widthProp };
  }
  const { height, placement, width } = openGeometryRef.current;

  const isHorizontal = placement === 'left' || placement === 'right';
  const sizeStyle: React.CSSProperties = isHorizontal ? { width } : { height };
  const resolvedPopupStyle: React.CSSProperties = {
    ...(layer?.zIndex === undefined ? undefined : { zIndex: layer.zIndex + 1 }),
    ...sizeStyle,
    ...popupStyle,
  };
  const popupXstyle = [styles.popup, popupPlacementClass[placement]];
  const resolvedPanelClassName = clsx(
    stylex.props(
      styles.panel,
      panelPlacementClass[placement],
      flush ? styles.panelFlush : panelRoundedClass[placement],
      panelXstyle,
    ).className,
    panelClassName,
  );

  if (open !== null && actions) {
    const motionConfig = getDrawerMotionConfig(placement, pushOffset);
    return (
      <Dialog.Popup
        {...rest}
        className={clsx(stylex.props(popupXstyle).className, className as string)}
        data-drawer-anchor={placement}
        ref={composedRef as any}
        style={resolvedPopupStyle}
      >
        <AnimatePresence onExitComplete={actions.onExitComplete}>
          {open ? (
            <Motion.div
              {...motionConfig}
              {...motionProps}
              className={resolvedPanelClassName}
              data-drawer-placement={placement}
              key="drawer-popup-panel"
              style={{ transition: 'none', ...panelStyle }}
            >
              {children}
            </Motion.div>
          ) : null}
        </AnimatePresence>
      </Dialog.Popup>
    );
  }

  const { axis, sign } = pushAxis[placement];
  const pushVars = {
    [axis === 'x' ? '--drawer-push-x' : '--drawer-push-y']: `${pushOffset * sign}px`,
  } as React.CSSProperties;

  return (
    <Dialog.Popup
      {...rest}
      className={mergeStateClassName(popupXstyle, className as any) as any}
      data-drawer-anchor={placement}
      ref={composedRef as any}
      style={resolvedPopupStyle}
    >
      <div
        className={resolvedPanelClassName}
        data-drawer-placement={placement}
        style={{ ...pushVars, ...panelStyle }}
      >
        {children}
      </div>
    </Dialog.Popup>
  );
};

export const DrawerPopup: React.FC<DrawerPopupProps> = DrawerPopupImpl;

export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const DrawerHeader = ({ className, style, ...rest }: DrawerHeaderProps) => (
  <div {...rest} {...styleProps(styles.header, className, style)} />
);

export type DrawerTitleProps = React.ComponentProps<typeof Dialog.Title>;
export const DrawerTitle = ({ className, ...rest }: DrawerTitleProps) => (
  <Dialog.Title {...rest} className={mergeStateClassName(styles.title, className as any) as any} />
);

export type DrawerDescriptionProps = React.ComponentProps<typeof Dialog.Description>;
export const DrawerDescription: React.FC<DrawerDescriptionProps> = Dialog.Description;

export type DrawerContentProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const DrawerContentImpl = ({
  className,
  style,
  xstyle,
  ...rest
}: DrawerContentProps & { xstyle?: XStyle }) => (
  <div {...rest} {...styleProps([styles.content, xstyle], className, style)} />
);
export const DrawerContent: React.FC<DrawerContentProps> = DrawerContentImpl;

export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};
export const DrawerFooter = ({ className, style, ...rest }: DrawerFooterProps) => (
  <div {...rest} {...styleProps(styles.footer, className, style)} />
);

export type DrawerCloseProps = React.ComponentProps<typeof Dialog.Close>;
export const DrawerClose = ({ className, children, ...rest }: DrawerCloseProps) => (
  <Dialog.Close
    {...rest}
    className={mergeStateClassName([styles.close, focusRing.info], className as any) as any}
  >
    {children ?? <X size={16} />}
  </Dialog.Close>
);

export type DrawerTriggerProps = Omit<
  React.ComponentPropsWithRef<typeof Dialog.Trigger>,
  'children' | 'render'
> & {
  children?: React.ReactNode;
  nativeButton?: boolean;
};

export const DrawerTrigger = ({
  children,
  className,
  nativeButton,
  ref: refProp,
  ...rest
}: DrawerTriggerProps) => {
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
