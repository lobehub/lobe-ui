import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI standard catalog (MIT), `standard/text.tsx` Tooltip: an inverted
// panel, 4px 8px padding, `radius-sm` (6px), `shadow-md`, `xs` text (0.75em / 1.333 of the text
// around the trigger), at most 240px wide.
export const styles = stylex.create({
  popup: {
    borderRadius: 6,
    backgroundColor: a2ui.inverted,
    boxShadow: a2ui.shadowMd,
    color: a2ui.onInverted,
    // The popup is portalled, so the trigger's font size comes in as a variable.
    fontSize: 'calc(var(--lobe-a2ui-tooltip-font-size, 16px) * 0.75)',
    lineHeight: 1.333,
  },
  viewport: {
    '--lobe-tooltip-viewport-inline-padding': '8px',
    'paddingBlock': 4,
    'maxWidth': 240,
  },
});
