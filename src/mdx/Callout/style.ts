import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  container: {
    '--lobe-markdown-margin-multiple': 1,
    'borderRadius': 'calc(var(--lobe-markdown-border-radius) * 1px)',
    'marginBlock': 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
    'overflow': 'hidden',
  },
  content: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * -1em)',
  },
  error: {
    backgroundColor: cssVar.colorErrorFillTertiary,
    boxShadow: `0 0 0 1px ${cssVar.colorErrorFillTertiary} inset`,
    color: cssVar.colorError,
  },
  icon: {
    marginBlock: '0.25em',
  },
  important: {
    backgroundColor: cssVar.purpleFillTertiary,
    boxShadow: `0 0 0 1px ${cssVar.purpleFillTertiary} inset`,
    color: cssVar.purple,
  },
  info: {
    backgroundColor: cssVar.colorInfoFillTertiary,
    boxShadow: `0 0 0 1px ${cssVar.colorInfoFillTertiary} inset`,
    color: cssVar.colorInfo,
  },
  inner: {
    marginBlock: 'calc(var(--lobe-markdown-margin-multiple) * 1em)',
  },
  tip: {
    backgroundColor: cssVar.colorSuccessFillTertiary,
    boxShadow: `0 0 0 1px ${cssVar.colorSuccessFillTertiary} inset`,
    color: cssVar.colorSuccess,
  },
  warning: {
    backgroundColor: cssVar.colorWarningFillTertiary,
    boxShadow: `0 0 0 1px ${cssVar.colorWarningFillTertiary} inset`,
    color: cssVar.colorWarning,
  },
});
