import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  borderless: {
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
    boxShadow: 'none',
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  error: {
    borderColor: cssVar.colorError,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  errorOutlined: {
    borderColor: { 'default': cssVar.colorError, ':hover': cssVar.colorBorder },
  },
  errorText: {
    color: cssVar.colorError,
    fontSize: 12,
  },
  filled: {
    backgroundColor: { 'default': cssVar.colorFillTertiary, ':hover': cssVar.colorFillSecondary },
  },
  focused: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  hiddenInput: {
    cursor: 'text',
    insetBlockStart: 0,
    insetInlineStart: 0,
    opacity: 0,
    position: 'absolute',
    zIndex: -1,
    height: '100%',
    width: '100%',
  },
  outlined: {
    borderColor: { 'default': cssVar.colorBorderSecondary, ':hover': cssVar.colorBorder },
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
  },
  placeholder: {
    color: cssVar.colorTextDescription,
  },
  root: {
    borderRadius: cssVar.borderRadius,
    paddingBlock: 0,
    paddingInline: 12,
    cursor: 'pointer',
    position: 'relative',
    height: 36,
    maxWidth: '100%',
  },
  shadow: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
});
