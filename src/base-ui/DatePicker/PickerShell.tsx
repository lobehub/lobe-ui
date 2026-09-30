'use client';

import { cx, useThemeMode } from 'antd-style';
import { type CSSProperties, memo, type ReactElement, type ReactNode, useRef } from 'react';

import ClearButton from '@/base-ui/Input/ClearButton';
import { rootVariants } from '@/base-ui/Input/style';
import type { InputSize, InputVariant } from '@/base-ui/Input/type';
import { panelStyles } from '@/base-ui/panelStyles';
import {
  PopoverPopup,
  PopoverPortal,
  PopoverPositioner,
  PopoverRoot,
  PopoverTriggerElement,
} from '@/base-ui/Popover';

export interface PickerShellProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  icon: ReactNode;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  shadow?: boolean;
  showClear: boolean;
  size?: InputSize;
  style?: CSSProperties;
  trigger: ReactElement;
  variant?: InputVariant;
}

const PickerShell = memo<PickerShellProps>(
  ({
    children,
    className,
    disabled,
    icon,
    onClear,
    onOpenChange,
    open,
    shadow,
    showClear,
    size = 'middle',
    style,
    trigger,
    variant,
  }) => {
    const { isDarkMode } = useThemeMode();
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
      <div
        data-disabled={disabled ? '' : undefined}
        ref={anchorRef}
        style={style}
        className={cx(
          rootVariants({ shadow, size, variant: variant || (isDarkMode ? 'filled' : 'outlined') }),
          className,
        )}
      >
        <PopoverRoot open={open} onOpenChange={(next) => !disabled && onOpenChange(next)}>
          <PopoverTriggerElement>{trigger}</PopoverTriggerElement>
          <PopoverPortal>
            <PopoverPositioner anchor={anchorRef} placement="bottomLeft">
              <PopoverPopup className={panelStyles.popup}>{children}</PopoverPopup>
            </PopoverPositioner>
          </PopoverPortal>
        </PopoverRoot>
        {showClear && !disabled ? <ClearButton onClear={onClear} /> : icon}
      </div>
    );
  },
);

PickerShell.displayName = 'PickerShell';

export default PickerShell;
