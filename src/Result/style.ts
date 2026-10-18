import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  customIcon: {
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    marginBlockEnd: 12,
  },
  extra: {
    gap: 8,
    alignItems: 'center',
    alignSelf: 'stretch',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBlockStart: 10,
  },
  icon: {
    borderRadius: '50%',
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    marginBlockEnd: 12,
    height: 72,
    width: 72,
  },
  iconError: {
    backgroundColor: `color-mix(in srgb, ${cssVar.colorError} 12%, transparent)`,
    color: cssVar.colorError,
  },
  iconInfo: {
    backgroundColor: cssVar.colorFillTertiary,
    color: cssVar.colorTextSecondary,
  },
  iconSuccess: {
    backgroundColor: `color-mix(in srgb, ${cssVar.colorSuccess} 12%, transparent)`,
    color: cssVar.colorSuccess,
  },
  iconWarning: {
    backgroundColor: `color-mix(in srgb, ${cssVar.colorWarning} 12%, transparent)`,
    color: cssVar.colorWarning,
  },
  root: {
    gap: 6,
    paddingBlock: 16,
    paddingInline: 8,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  subTitle: {
    margin: 0,
    color: cssVar.colorTextTertiary,
    fontSize: 13,
    maxWidth: '36ch',
  },
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    textWrap: 'balance',
  },
});
