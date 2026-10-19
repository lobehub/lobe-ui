import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const shimmer = stylex.keyframes({
  from: { backgroundPosition: '-80px 0' },
  to: { backgroundPosition: '200px 0' },
});

export const styles = stylex.create({
  bar: {
    borderRadius: 999,
    transition: 'width 0.3s',
    height: '100%',
  },
  barActive: {
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: { 'default': shimmer, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: 'linear',
    backgroundImage: `linear-gradient(90deg, transparent, color-mix(in srgb, ${cssVar.colorWhite} 35%, transparent), transparent)`,
    backgroundSize: '80px 100%',
  },
  blockLg: {
    height: 12,
  },
  blockMd: {
    height: 8,
  },
  blockSm: {
    height: 4,
  },
  circleBar: {
    transition: 'stroke-dashoffset 0.3s',
  },
  circleInfo: {
    color: cssVar.colorText,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
  circleInfoLg: {
    fontSize: 17,
  },
  circleInfoMd: {
    fontSize: 12,
  },
  circleRoot: {
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
    position: 'relative',
  },
  circleSvg: {
    rotate: '-90deg',
  },
  circleTrack: {
    fill: 'none',
    stroke: cssVar.colorFillTertiary,
  },
  fillActive: {
    backgroundColor: cssVar.colorInfo,
  },
  fillException: {
    backgroundColor: cssVar.colorError,
  },
  fillMinLg: {
    minWidth: 12,
  },
  fillMinMd: {
    minWidth: 8,
  },
  fillMinSm: {
    minWidth: 4,
  },
  fillNormal: {
    backgroundColor: cssVar.colorPrimary,
  },
  fillSuccess: {
    backgroundColor: cssVar.colorSuccess,
  },
  iconException: {
    color: cssVar.colorError,
  },
  iconSuccess: {
    color: cssVar.colorSuccess,
  },
  lineLg: {
    height: 6,
  },
  lineMd: {
    height: 4,
  },
  lineMeta: {
    gap: 12,
    alignItems: 'baseline',
    color: cssVar.colorTextSecondary,
    display: 'flex',
    fontSize: cssVar.fontSizeSM,
    justifyContent: 'space-between',
  },
  lineRoot: {
    gap: 6,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  lineSm: {
    height: 2,
  },
  lineTrack: {
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: cssVar.colorFillTertiary,
  },
  lineValue: {
    color: cssVar.colorText,
    fontFamily: cssVar.fontFamilyCode,
    fontVariantNumeric: 'tabular-nums',
  },
  rowInfo: {
    color: cssVar.colorTextSecondary,
    fontFamily: cssVar.fontFamilyCode,
    fontSize: cssVar.fontSizeSM,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'end',
    minWidth: '3.5ch',
  },
  rowRoot: {
    flex: '1',
    gap: 10,
    alignItems: 'center',
    display: 'flex',
    width: '100%',
  },
  segment: {
    borderRadius: 1,
    flex: '1',
    backgroundColor: cssVar.colorFillTertiary,
  },
  segments: {
    flex: '1',
    gap: 2,
    display: 'flex',
    minWidth: 0,
  },
  split: {
    flex: '1',
    gap: 3,
    display: 'flex',
    minWidth: 0,
  },
  splitFill: {
    borderRadius: 999,
    flex: 'none',
    transition: 'width 0.3s',
  },
  splitRest: {
    borderRadius: 999,
    flex: '1',
    backgroundColor: cssVar.colorFillSecondary,
  },
});
