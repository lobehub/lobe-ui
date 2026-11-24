import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  additions: {
    color: cssVar.colorSuccess,
  },
  deletions: {
    color: cssVar.colorError,
  },
  kind: {
    borderRadius: '50%',
    flexShrink: 0,
    height: 8,
    width: 8,
  },
  kindAdded: {
    backgroundColor: cssVar.colorSuccess,
  },
  kindDeleted: {
    backgroundColor: cssVar.colorError,
  },
  kindModified: {
    backgroundColor: cssVar.colorInfo,
  },
  kindRenamed: {
    backgroundColor: cssVar.colorWarning,
  },
  root: {
    gap: 6,
    alignItems: 'center',
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
});
