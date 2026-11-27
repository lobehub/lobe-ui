import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI standard catalog (MIT), `standard/feedback.tsx` PopoverContent:
// an elevated panel with a hairline, `radius-lg` (14px in the playground), `shadow-md`, 12px
// padding and an 8px gap, at least 160px wide. The standard panel is absolutely positioned
// inside the trigger, so a centred one wraps at half the trigger's width (or 160px) and an
// edge-aligned one at the trigger's width; `PopoverStandalone` measures that into
// `--lobe-a2ui-popover-max-width` when it opens.
export const styles = stylex.create({
  popup: {
    borderColor: a2ui.fg10,
    borderRadius: a2ui.radius,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: a2ui.surface2,
    boxShadow: a2ui.shadowMd,
    color: a2ui.fg,
    // The popup is portalled, so the trigger's font size comes in as a variable.
    fontSize: 'var(--lobe-a2ui-popover-font-size, inherit)',
    lineHeight: 1.5,
    maxWidth: 'var(--lobe-a2ui-popover-max-width, 320px)',
    minWidth: 160,
  },
  viewport: {
    '--lobe-popover-viewport-inline-padding': '12px',
    'gap': 8,
    'paddingBlock': 12,
    'display': 'flex',
    'flexDirection': 'column',
  },
});
