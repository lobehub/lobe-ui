import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  bordered: {
    boxShadow: `inset 0 0 0 1px ${cssVar.colorBorderSecondary}`,
  },
  icon: {
    borderRadius: '50%',
    overflow: 'hidden',
    alignItems: 'center',
    boxShadow: '0 0 0 4px #fff',
    display: 'flex',
    insetBlockStart: '50%',
    insetInlineStart: '50%',
    justifyContent: 'center',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    inset: 0,
    borderRadius: 16,
    gap: 12,
    alignItems: 'center',
    backgroundColor: 'rgb(255 255 255 / 95%)',
    color: '#080808',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
  },
  overlayTitle: {
    fontSize: 17,
    fontWeight: 600,
  },
  refresh: {
    borderRadius: 999,
    borderStyle: 'none',
    borderWidth: 0,
    fontVariant: 'inherit',
    gap: 6,
    paddingInline: 14,
    alignItems: 'center',
    backgroundColor: cssVar.colorText,
    color: cssVar.colorBgContainer,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: 13,
    fontStretch: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 500,
    justifyContent: 'center',
    lineHeight: 'inherit',
    height: 32,
  },
  root: {
    padding: 16,
    borderRadius: 16,
    display: 'inline-flex',
    position: 'relative',
  },
});
