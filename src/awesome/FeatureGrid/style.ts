import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

const tabletOnly = '@media (min-width: 480px) and (max-width: 767.98px)';

export const styles = stylex.create({
  description: {
    margin: 0,
    color: cssVar.colorTextSecondary,
    fontSize: 13.5,
    lineHeight: 1.65,
    textWrap: 'pretty',
  },
  grid: {
    gap: 16,
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(var(--feature-grid-columns), minmax(0, 1fr))',
      [tabletOnly]: 'repeat(2, minmax(0, 1fr))',
      [media.mobile]: '1fr',
    },
  },
  icon: {
    borderRadius: 9,
    alignItems: 'center',
    backgroundColor: cssVar.colorPrimaryBg,
    blockSize: 30,
    color: cssVar.colorPrimary,
    display: 'flex',
    inlineSize: 30,
    justifyContent: 'center',
    marginBlockEnd: 14,
  },
  item: {
    borderColor: {
      'default': cssVar.colorBorderSecondary,
      ':hover': cssVar.colorBorder,
    },
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingInline: 20,
    textDecoration: 'none',
    transition: 'border-color 140ms ease, box-shadow 140ms ease',
    backgroundColor: `color-mix(in srgb, ${cssVar.colorBgElevated} 25%, transparent)`,
    boxShadow: {
      'default': cssVar.boxShadowTertiary,
      ':hover': cssVar.boxShadowSecondary,
    },
    color: 'inherit',
    display: 'block',
    paddingBlockEnd: '22px',
    paddingBlockStart: '20px',
  },
  title: {
    marginInline: 0,
    color: cssVar.colorText,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    marginBlockEnd: '6px',
    marginBlockStart: '0',
  },
});
