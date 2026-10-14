'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import clsx from 'clsx';
import { AnimatePresence, type MotionProps } from 'motion/react';
import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  use,
  useLayoutEffect,
  useState,
} from 'react';

import { useMotionComponent } from '@/MotionProvider';
import { PopoverPortal, PopoverPositioner } from '@/Popover/atoms';
import { placementMap } from '@/utils/placement';

import PickerContext from './PickerInput/context';
import { getRealPlacement } from './utils/uiUtil';

const ease = [0.22, 1, 0.36, 1] as const;

const motionProps = (side: 'top' | 'bottom'): MotionProps => {
  const hidden = { opacity: 0, scale: 0.98, y: side === 'top' ? 4 : -4 };
  return {
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { ...hidden, transition: { duration: 0.1, ease } },
    initial: hidden,
    transition: { duration: 0.15, ease },
  };
};

export interface PickerPopupProps {
  children: ReactElement;
  direction?: 'ltr' | 'rtl';
  getAnchor: () => Element | null | undefined;
  getPopupContainer?: (node: HTMLElement) => HTMLElement;
  inline?: boolean;
  onClose: () => void;
  placement?: string;
  popupClassName?: string;
  popupElement: ReactNode;
  popupStyle?: CSSProperties;
  range?: boolean;
  visible: boolean;
}

// The input keeps focus while the popup is open: the popup never takes it, and a press on the
// input is not an outside press.
const PickerPopup = ({
  children,
  direction,
  getAnchor,
  getPopupContainer,
  inline,
  onClose,
  placement,
  popupClassName,
  popupElement,
  popupStyle,
  range,
  visible,
}: PickerPopupProps) => {
  const { prefixCls } = use(PickerContext);
  const Motion = useMotionComponent();
  const dropdownPrefixCls = `${prefixCls}-dropdown`;

  // Stays true through the exit animation, so Base UI keeps the popup mounted until Motion is done.
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);
  if (inline && !visible && mounted) setMounted(false);

  const rtl = direction === 'rtl';
  const { align, side } =
    placementMap[getRealPlacement(placement, rtl) as keyof typeof placementMap];
  const anchor = () => getAnchor() ?? null;
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!mounted) return;
    const element = getAnchor();
    setContainer(
      element instanceof HTMLElement && getPopupContainer
        ? getPopupContainer(element)
        : (element?.ownerDocument.body ?? null),
    );
  }, [mounted, getAnchor, getPopupContainer]);

  return (
    <BasePopover.Root
      modal={false}
      open={mounted}
      onOpenChange={(open, details) => {
        if (open) return;
        const target = details.event?.target;
        if (
          details.reason === 'outside-press' &&
          target instanceof Node &&
          getAnchor()?.contains(target)
        ) {
          details.cancel();
          return;
        }
        onClose();
      }}
    >
      {children}
      {mounted && container && (
        <PopoverPortal container={container}>
          <PopoverPositioner
            align={align}
            anchor={anchor}
            side={side}
            sideOffset={4}
            collisionAvoidance={
              inline
                ? { align: 'none', fallbackAxisSide: 'none', side: 'none' }
                : { align: 'shift', fallbackAxisSide: 'none', side: 'flip' }
            }
            {...(inline && { style: { zIndex: 'auto' } })}
          >
            <BasePopover.Popup
              finalFocus={false}
              initialFocus={false}
              style={{ minWidth: 'var(--anchor-width)', ...popupStyle }}
              className={clsx(
                dropdownPrefixCls,
                range && `${dropdownPrefixCls}-range`,
                rtl && `${dropdownPrefixCls}-rtl`,
                popupClassName,
              )}
            >
              {inline ? (
                visible && popupElement
              ) : (
                <AnimatePresence onExitComplete={() => setMounted(false)}>
                  {visible ? (
                    <Motion.div
                      key="picker-popup"
                      style={{ transformOrigin: 'var(--transform-origin)' }}
                      {...motionProps(side === 'top' ? 'top' : 'bottom')}
                    >
                      {popupElement}
                    </Motion.div>
                  ) : null}
                </AnimatePresence>
              )}
            </BasePopover.Popup>
          </PopoverPositioner>
        </PopoverPortal>
      )}
    </BasePopover.Root>
  );
};

export default PickerPopup;
