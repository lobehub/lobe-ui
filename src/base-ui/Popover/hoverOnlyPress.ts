/**
 * Base UI Popover.Trigger always wires useClick. With openOnHover, a press while
 * the popup is hover-open can re-open with reason `trigger-press` (stickIfOpen),
 * which disables mouseleave dismiss. Hover-only triggers must cancel press-driven
 * opens so antd-compatible `trigger="hover"` keeps hover close semantics.
 */
export function shouldCancelHoverOnlyPressOpen(
  openOnClick: boolean,
  nextOpen: boolean,
  reason: string | undefined,
): boolean {
  return !openOnClick && nextOpen && reason === 'trigger-press';
}
