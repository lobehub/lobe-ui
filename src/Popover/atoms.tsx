'use client';

import { mergeProps } from '@base-ui/react/merge-props';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { cx } from 'antd-style';
import {
  cloneElement,
  type ComponentProps,
  type ComponentPropsWithRef,
  isValidElement,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

import { FloatingLayerProvider } from '@/hooks/useFloatingLayer';
import { useNativeButton } from '@/hooks/useNativeButton';
import { placementMap } from '@/utils/placement';

import { PopoverArrowIcon } from './ArrowIcon';
import { usePopoverPortalContainer } from './PopoverPortal';
import { styles } from './style';
import { type PopoverPlacement } from './type';

export const PopoverRoot = BasePopover.Root;
export const PopoverBackdrop = BasePopover.Backdrop;

export type PopoverTriggerElementProps = Omit<
  ComponentPropsWithRef<typeof BasePopover.Trigger>,
  'children' | 'render'
> & {
  children: ComponentProps<typeof BasePopover.Trigger>['children'];
};

export const PopoverTriggerElement = ({
  children,
  className,
  nativeButton,
  ref: refProp,
  ...rest
}: PopoverTriggerElementProps) => {
  const { isNativeButtonTriggerElement, resolvedNativeButton } = useNativeButton({
    children,
    nativeButton,
  });

  if (isValidElement(children)) {
    return (
      <BasePopover.Trigger
        {...rest}
        nativeButton={resolvedNativeButton}
        render={(props, state) => {
          // Base UI's trigger props include `type="button"` by default.
          // If we render into a non-<button> element, that prop is invalid and can warn.
          const resolvedProps = (() => {
            if (isNativeButtonTriggerElement) return props as any;
            // eslint-disable-next-line unused-imports/no-unused-vars
            const { type, ref: triggerRef, ...restProps } = props as any;
            return restProps;
          })();

          const mergedProps = mergeProps((children as any).props, resolvedProps);
          const baseClassName =
            typeof (mergedProps as any).className === 'function'
              ? (mergedProps as any).className(state)
              : (mergedProps as any).className;
          const extraClassName =
            typeof (className as any) === 'function' ? (className as any)(state) : className;

          return cloneElement(children as any, {
            ...mergedProps,
            className: cx(baseClassName, extraClassName),
            ref: mergeRefs([(children as any).ref, (props as any).ref, refProp]),
          });
        }}
      />
    );
  }

  return (
    <BasePopover.Trigger
      {...rest}
      className={className}
      nativeButton={resolvedNativeButton}
      ref={refProp}
    >
      {children}
    </BasePopover.Trigger>
  );
};

PopoverTriggerElement.displayName = 'PopoverTriggerElement';

export type PopoverPortalAtomProps = Omit<
  ComponentProps<typeof BasePopover.Portal>,
  'container'
> & {
  /**
   * Portal container. When not provided, it uses the shared container created by `usePopoverPortalContainer`.
   */
  container?: HTMLElement | null;
  /**
   * Root element used by `usePopoverPortalContainer` to create the default container.
   */
  root?: HTMLElement | ShadowRoot | null;
};

export const PopoverPortal = ({ container, root, children, ...rest }: PopoverPortalAtomProps) => {
  const defaultContainer = usePopoverPortalContainer(root);
  const resolvedContainer = container ?? defaultContainer;

  if (!resolvedContainer) return null;

  return (
    <BasePopover.Portal container={resolvedContainer} {...rest}>
      {children}
    </BasePopover.Portal>
  );
};

PopoverPortal.displayName = 'PopoverPortal';

export type PopoverPositionerAtomProps = ComponentProps<typeof BasePopover.Positioner> & {
  hoverTrigger?: boolean;
  placement?: PopoverPlacement;
};

export const PopoverPositioner = ({
  children,
  className,
  hoverTrigger,
  placement,
  align,
  side,
  sideOffset,
  ...rest
}: PopoverPositionerAtomProps) => {
  const placementConfig = placement ? placementMap[placement] : undefined;
  const [positionerNode, setPositionerNode] = useState<HTMLDivElement | null>(null);

  return (
    <BasePopover.Positioner
      align={align ?? placementConfig?.align ?? 'center'}
      data-hover-trigger={hoverTrigger || undefined}
      data-placement={placement}
      ref={setPositionerNode}
      side={side ?? placementConfig?.side ?? 'bottom'}
      sideOffset={sideOffset ?? 6}
      className={(state) =>
        cx(styles.positioner, typeof className === 'function' ? className(state) : className)
      }
      {...rest}
    >
      <FloatingLayerProvider value={positionerNode}>{children}</FloatingLayerProvider>
    </BasePopover.Positioner>
  );
};

PopoverPositioner.displayName = 'PopoverPositioner';

export type PopoverPopupAtomProps = ComponentProps<typeof BasePopover.Popup>;

export const PopoverPopup = ({ className, ...rest }: PopoverPopupAtomProps) => {
  return (
    <BasePopover.Popup
      className={(state) =>
        cx(styles.popup, typeof className === 'function' ? className(state) : className)
      }
      {...rest}
    />
  );
};

PopoverPopup.displayName = 'PopoverPopup';

export type PopoverArrowAtomProps = ComponentProps<typeof BasePopover.Arrow>;

export const PopoverArrow = ({ className, children, ...rest }: PopoverArrowAtomProps) => {
  return (
    <BasePopover.Arrow
      className={(state) =>
        cx(styles.arrow, typeof className === 'function' ? className(state) : className)
      }
      {...rest}
    >
      {children ?? PopoverArrowIcon}
    </BasePopover.Arrow>
  );
};

PopoverArrow.displayName = 'PopoverArrow';

export type PopoverViewportAtomProps = ComponentProps<typeof BasePopover.Viewport>;

export const PopoverViewport = ({ className, ...rest }: PopoverViewportAtomProps) => {
  return (
    <BasePopover.Viewport
      className={(state) =>
        cx(styles.viewport, typeof className === 'function' ? className(state) : className)
      }
      {...rest}
    />
  );
};

PopoverViewport.displayName = 'PopoverViewport';
