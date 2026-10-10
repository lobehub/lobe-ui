import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  body: {
    marginBlockStart: 32,
  },
  description: {
    margin: 0,
    color: cssVar.colorTextSecondary,
    fontSize: 15,
    lineHeight: 1.6,
    maxInlineSize: '34rem',
    textWrap: 'pretty',
  },
  extra: {
    flex: 'none',
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
  },
  extraStart: {
    alignSelf: { default: null, [media.mobile]: 'flex-start' },
  },
  eyebrow: {
    marginBlockEnd: 6,
  },
  header: {
    gap: 20,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  headerStart: {
    gap: { default: 32, [media.mobile]: 16 },
    alignItems: { default: 'flex-end', [media.mobile]: 'stretch' },
    flexDirection: { default: 'row', [media.mobile]: 'column' },
    justifyContent: 'space-between',
    textAlign: 'start',
  },
  heading: {
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
  },
  headingStart: {
    alignItems: 'flex-start',
  },
  root: {
    paddingBlock: 'clamp(48px,8vh,80px)',
  },
  rootDivider: {
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  title: {
    margin: 0,
    color: cssVar.colorText,
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 'bold',
    letterSpacing: '-0.025em',
    lineHeight: 1.2,
    textWrap: 'balance',
  },
});
