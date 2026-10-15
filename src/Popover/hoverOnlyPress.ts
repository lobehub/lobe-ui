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

/**
 * Stamped on a grouped trigger that only opens on hover. The group arbitrates
 * open changes for every member from one handler, and the event only carries the
 * trigger element — without this it cannot tell which member the press belongs to
 * and would judge it by whichever member happens to be active.
 */
export const HOVER_ONLY_TRIGGER_ATTR = 'data-hover-only-trigger';

export function isHoverOnlyTriggerElement(trigger: unknown): boolean | null {
  if (typeof Element === 'undefined' || !(trigger instanceof Element)) return null;

  return trigger.hasAttribute(HOVER_ONLY_TRIGGER_ATTR);
}
