'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

import { PopoverPortal, PopoverPositioner } from '@/Popover/atoms';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { a2uiStyles } from './styles';
import { a2ui } from './tokens.stylex';

const startingOrEnding = ':is([data-starting-style], [data-ending-style])';

/**
 * The popover of the A2UI playground's Combobox and DatePicker: a 10px panel on the elevated
 * surface with a hairline ring and the floating shadow, fading and zooming in from 95%.
 * Adapted from CopilotKit a2ui-playground (MIT), shadcn `components/ui/popover.tsx`.
 *
 * `variant="default"` draws the same panel as a lobe-ui popup (theme radius and secondary shadow).
 */
const styles = stylex.create({
  dPopup: {
    borderRadius: cssVar.borderRadiusLG,
    boxShadow: `${cssVar.boxShadowSecondary}, 0 0 0 1px ${cssVar.colorBorderSecondary}`,
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamily,
    fontSize: cssVar.fontSize,
  },
  popup: {
    borderRadius: 10,
    outline: 'none',
    overflow: 'hidden',
    transitionDuration: '100ms',
    transitionProperty: 'opacity, transform',
    backgroundColor: a2ui.surface2,
    boxShadow: `${a2ui.shadowMd}, 0 0 0 1px ${a2ui.fg10}`,
    boxSizing: 'border-box',
    color: a2ui.fg,
    fontSize: 14,
    lineHeight: 1.4286,
    opacity: { default: 1, [startingOrEnding]: 0 },
    transform: { default: null, [startingOrEnding]: 'scale(0.95)' },
    transformOrigin: 'var(--transform-origin)',
  },
});

export interface PlaygroundPopoverProps {
  children: ReactNode;
  className?: string;
  /** Panel width follows the trigger (Combobox). */
  matchTriggerWidth?: boolean;
  /** Smallest panel width in px when `matchTriggerWidth` is set. */
  minWidth?: number;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  /** Extra style on the panel. */
  popupStyle?: CSSProperties;
  /** The trigger button element. */
  trigger: ReactElement;
  variant?: 'default' | 'a2ui';
}

const PlaygroundPopover = ({
  children,
  className,
  matchTriggerWidth,
  minWidth,
  onOpenChange,
  open,
  popupStyle,
  trigger,
  variant = 'a2ui',
}: PlaygroundPopoverProps) => (
  <BasePopover.Root modal={false} open={open} onOpenChange={(next) => onOpenChange(next)}>
    <BasePopover.Trigger render={trigger} />
    <PopoverPortal>
      <PopoverPositioner align="start" side="bottom" sideOffset={4}>
        <BasePopover.Popup
          finalFocus={false}
          {...styleProps(
            variant === 'a2ui' ? [a2uiStyles.base, styles.popup] : [styles.popup, styles.dPopup],
            className,
            {
              ...(matchTriggerWidth && { minWidth, width: 'var(--anchor-width)' }),
              ...popupStyle,
            },
          )}
        >
          {children}
        </BasePopover.Popup>
      </PopoverPositioner>
    </PopoverPortal>
  </BasePopover.Root>
);

export default PlaygroundPopover;
