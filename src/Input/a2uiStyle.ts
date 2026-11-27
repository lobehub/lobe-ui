import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `TextField` and `TextArea`
// (`controlStyle`); the shared control look is `a2uiFieldStyles` in `@/internal/a2ui/standardField`.
const invalid = ":has([data-invalid], [aria-invalid='true'])";
const disabled = ':is([data-disabled], :has(input:disabled, textarea:disabled))';

export const styles = stylex.create({
  root: {
    gap: 8,
    alignItems: 'center',
    borderColor: { default: a2ui.input, [invalid]: cssVar.colorError },
    cursor: { default: 'text', [disabled]: 'not-allowed' },
    display: 'flex',
    opacity: { default: null, [disabled]: 0.5 },
  },
  slot: {
    flex: 'none',
    alignItems: 'center',
    color: cssVar.colorTextTertiary,
    display: 'inline-flex',
  },
  /** `TextArea`: radius `md` (8px), `PAD_X / 2` block padding, line height 1.5. */
  textarea: {
    borderRadius: 8,
    paddingBlock: 9,
    alignItems: 'stretch',
    position: 'relative',
    height: 'auto',
  },
  textareaControl: {
    lineHeight: 1.5,
    resize: 'vertical',
  },
  textareaControlFixed: {
    resize: 'none',
  },
});
