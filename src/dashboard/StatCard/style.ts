import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

export const styles = stylex.create({
  badge: {
    borderColor: cssVar.colorFillSecondary,
    borderRadius: cssVar.borderRadiusSM,
    borderStyle: 'solid',
    borderWidth: 1,
    flex: 'none',
    alignItems: 'center',
    backgroundColor: cssVar.colorFillTertiary,
    blockSize: 24,
    color: cssVar.colorTextTertiary,
    display: 'inline-flex',
    inlineSize: 24,
    justifyContent: 'center',
  },
  body: {
    position: 'relative',
    zIndex: 1,
  },
  copy: {
    flexWrap: 'nowrap',
    minInlineSize: 0,
  },
  delta: {
    gap: 2,
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: cssVar.fontSizeSM,
    fontVariantNumeric: 'tabular-nums',
  },
  deltaDown: {
    color: cssVar.colorError,
  },
  deltaFlat: {
    color: cssVar.colorTextTertiary,
  },
  deltaUp: {
    color: cssVar.colorSuccess,
  },
  frame: {
    borderColor: cssVar.colorBorderSecondary,
  },
  gray: {
    '::before': {
      backgroundImage: `linear-gradient(to bottom, ${cssVar.colorBgElevated} 0%, color-mix(in srgb, ${cssVar.colorText} 4%, ${cssVar.colorBgElevated}) 100%)`,
    },
  },
  lift: {
    borderRadius: cssVar.borderRadiusLG,
    boxShadow: cssVar.boxShadowTertiary,
    display: 'flex',
    minInlineSize: 0,
  },
  metricFoot: {
    marginBlockStart: 14,
  },
  metricValue: {
    color: cssVar.colorText,
    fontSize: cssVar.fontSizeHeading2,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 700,
    lineHeight: 1.05,
    marginBlockStart: 6,
  },
  root: {
    padding: 16,
    flex: '1',
    overflow: 'hidden',
    minInlineSize: 0,
    position: 'relative',
  },
  value: {
    color: cssVar.colorText,
    fontSize: { default: cssVar.fontSizeHeading2, [media.mobile]: cssVar.fontSizeHeading3 },
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  wash: {
    'isolation': 'isolate',
    '::before': {
      inset: 0,
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      zIndex: 0,
    },
  },
});
