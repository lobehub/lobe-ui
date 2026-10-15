import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const pulse = stylex.keyframes({
  to: { opacity: 0, scale: 2.4 },
});

export const styles = stylex.create({
  pill: {
    borderRadius: 999,
    paddingInline: 5,
    backgroundColor: cssVar.colorError,
    boxShadow: `0 0 0 1.5px ${cssVar.colorBgContainer}`,
    boxSizing: 'border-box',
    color: cssVar.colorWhite,
    display: 'inline-block',
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    lineHeight: '18px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    height: 18,
    minWidth: 18,
  },
  pillAbsolute: {
    insetBlockStart: 0,
    insetInlineEnd: 0,
    position: 'absolute',
    translate: '50% -50%',
  },
  pillDot: {
    padding: 0,
    paddingInline: 0,
    boxShadow: 'none',
    height: 8,
    minWidth: 0,
    width: 8,
  },
  pillSmall: {
    fontSize: 11,
    lineHeight: '14px',
    height: 14,
    minWidth: 14,
  },
  statusDot: {
    borderRadius: '50%',
    backgroundColor: cssVar.colorTextQuaternary,
    flexShrink: 0,
    position: 'relative',
    height: 6,
    width: 6,
  },
  statusDotProcessing: {
    '::after': {
      inset: -1,
      borderColor: 'currentcolor',
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: 1,
      animationDuration: '1.2s',
      animationIterationCount: 'infinite',
      animationName: { 'default': pulse, '@media (prefers-reduced-motion: reduce)': 'none' },
      animationTimingFunction: 'ease-out',
      content: "''",
      position: 'absolute',
    },
  },
  statusRoot: {
    gap: 8,
    alignItems: 'center',
    display: 'inline-flex',
  },
  statusText: {
    color: cssVar.colorText,
  },
  wrapper: {
    display: 'inline-block',
    position: 'relative',
  },
});

export const statusColor: Record<string, string> = {
  default: cssVar.colorTextQuaternary,
  error: cssVar.colorError,
  processing: cssVar.colorInfo,
  success: cssVar.colorSuccess,
  warning: cssVar.colorWarning,
};
