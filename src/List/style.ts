import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import { listItemMarker } from './marker.stylex';

export const styles = stylex.create({
  actions: {
    gap: 4,
    alignItems: 'center',
    display: {
      default: 'none',
      [stylex.when.ancestor(':focus-within', listItemMarker)]: 'inline-flex',
      [stylex.when.ancestor(':hover', listItemMarker)]: 'inline-flex',
    },
    insetBlockStart: '50%',
    insetInlineEnd: 8,
    position: 'absolute',
    transform: 'translateY(-50%)',
  },
  active: {
    backgroundColor: cssVar.colorFillSecondary,
    color: cssVar.colorText,
    fontWeight: 500,
  },
  body: {
    gap: 1,
    display: 'flex',
    flexBasis: '0%',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  compactRow: {
    paddingInline: 8,
  },
  danger: {
    color: cssVar.colorError,
  },
  description: {
    overflow: 'hidden',
    color: cssVar.colorTextDescription,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.4,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.45,
  },
  divider: {
    marginBlock: 4,
    backgroundColor: cssVar.colorBorderSecondary,
    height: 1,
  },
  extra: {
    flex: 'none',
    color: cssVar.colorTextDescription,
    fontSize: 12,
  },
  filled: {
    padding: 4,
    borderRadius: cssVar.borderRadiusLG,
    backgroundColor: cssVar.colorFillQuaternary,
  },
  item: {
    position: 'relative',
  },
  label: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  outlined: {
    padding: 4,
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  root: {
    margin: 0,
    padding: 0,
    gap: 2,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 0,
    fontVariant: 'inherit',
    gap: 12,
    paddingBlock: 6,
    paddingInline: 12,
    textDecoration: 'none',
    alignItems: 'center',
    backgroundColor: { 'default': 'transparent', ':hover': cssVar.colorFillTertiary },
    boxSizing: 'border-box',
    color: { 'default': cssVar.colorTextSecondary, ':hover': cssVar.colorText },
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: 14,
    fontStretch: 'inherit',
    fontStyle: 'inherit',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    textAlign: 'start',
    minHeight: 32,
    width: '100%',
  },
  showAction: {
    display: 'inline-flex',
  },
});
