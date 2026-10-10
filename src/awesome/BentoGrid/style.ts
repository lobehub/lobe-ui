import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

const tabletOnly = '@media (min-width: 480px) and (max-width: 767.98px)';

export const styles = stylex.create({
  body: {
    flex: '1',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    marginBlockStart: 12,
    minInlineSize: 0,
  },
  card: {
    borderColor: {
      'default': cssVar.colorBorderSecondary,
      ':hover': cssVar.colorBorder,
    },
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    gridColumn: {
      default: 'span var(--bento-col-span, 1)',
      [tabletOnly]: { 'default': null, ':is([data-wide="true"])': 'span 2' },
      [media.mobile]: 'span 1',
    },
    gridRow: {
      default: 'span var(--bento-row-span, 1)',
      [media.mobile]: 'span 1',
    },
    paddingInline: 16,
    transition: 'border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgElevated} 25%, transparent)`,
    boxShadow: {
      'default': cssVar.boxShadowTertiary,
      ':hover': cssVar.boxShadowSecondary,
    },
    display: 'flex',
    flexDirection: 'column',
    minInlineSize: 0,
    paddingBlockEnd: '16px',
    paddingBlockStart: '14px',
    transform: {
      'default': null,
      ':hover': 'translateY(-2px)',
      '@media (prefers-reduced-motion: reduce)': { 'default': null, ':hover': 'none' },
    },
  },
  grid: {
    gap: 12,
    display: 'grid',
    gridAutoRows: 'minmax(var(--bento-row-height), auto)',
    gridTemplateColumns: {
      default: 'repeat(var(--bento-columns), minmax(0, 1fr))',
      [tabletOnly]: 'repeat(2, minmax(0, 1fr))',
      [media.mobile]: '1fr',
    },
  },
  header: {
    gap: 8,
    alignItems: 'baseline',
    display: 'flex',
    justifyContent: 'space-between',
  },
  hint: {
    overflow: 'hidden',
    color: cssVar.colorTextTertiary,
    fontSize: 11,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  title: {
    textDecoration: 'none',
    color: {
      'default': cssVar.colorText,
      ':is([href]):hover': cssVar.colorPrimary,
    },
    fontSize: cssVar.fontSizeSM,
    fontWeight: 600,
  },
});
