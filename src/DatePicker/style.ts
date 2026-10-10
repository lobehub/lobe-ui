import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const pressed = ":is([aria-pressed='true'])";
const dayMuted = ":is(:disabled, [data-outside]):not([aria-pressed='true'])";
const tileMuted = ":disabled:not([aria-pressed='true'])";
const hoverable = ":hover:not(:disabled, [aria-pressed='true'])";

export const styles = stylex.create({
  band: {
    backgroundColor: cssVar.colorFillSecondary,
  },
  bandEnd: {
    backgroundImage: `linear-gradient(to left, transparent 50%, ${cssVar.colorFillSecondary} 50%)`,
  },
  bandStart: {
    backgroundImage: `linear-gradient(to right, transparent 50%, ${cssVar.colorFillSecondary} 50%)`,
  },
  calendar: {
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
    width: 266,
  },
  cell: {
    display: 'flex',
    justifyContent: 'center',
  },
  day: {
    font: 'inherit',
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: '50%',
    borderStyle: 'none',
    borderWidth: 0,
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      [hoverable]: cssVar.colorFillTertiary,
      [pressed]: cssVar.colorText,
    },
    boxShadow: { default: null, ':is([data-today])': `inset 0 0 0 1px ${cssVar.colorText}` },
    color: {
      [dayMuted]: cssVar.colorTextQuaternary,
      default: cssVar.colorText,
      [pressed]: cssVar.colorBgContainer,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'flex',
    fontSize: 13,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: { default: null, [pressed]: 600 },
    justifyContent: 'center',
    height: 34,
    width: 34,
  },
  footer: {
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    marginBlockStart: 12,
    paddingBlockStart: 12,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    rowGap: 2,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBlockEnd: 4,
  },
  icon: {
    flex: 'none',
    color: cssVar.colorTextTertiary,
    display: 'inline-flex',
  },
  navGroup: {
    gap: 2,
    display: 'flex',
  },
  placeholder: {
    color: cssVar.colorTextPlaceholder,
  },
  range: {
    gap: 28,
    display: 'flex',
  },
  rangeHalf: {
    flex: '1',
    paddingBlock: 2,
    boxShadow: { default: null, ':is([data-active])': `inset 0 -2px 0 ${cssVar.colorText}` },
    minWidth: 0,
  },
  rangeTrigger: {
    flex: '1',
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    minWidth: 0,
  },
  tile: {
    font: 'inherit',
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: 999,
    borderStyle: 'none',
    borderWidth: 0,
    backgroundColor: {
      default: 'transparent',
      [hoverable]: cssVar.colorFillTertiary,
      [pressed]: cssVar.colorText,
    },
    boxShadow: { default: null, ':is([data-today])': `inset 0 0 0 1px ${cssVar.colorText}` },
    color: {
      default: cssVar.colorText,
      [pressed]: cssVar.colorBgContainer,
      [tileMuted]: cssVar.colorTextQuaternary,
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    fontSize: 14,
    fontWeight: { default: null, [pressed]: 600 },
    height: 40,
  },
  tiles: {
    columnGap: 4,
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    rowGap: 6,
    width: 266,
  },
  trigger: {
    font: 'inherit',
    padding: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 0,
    flex: '1',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: 'inherit',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'flex',
    textAlign: 'start',
    whiteSpace: 'nowrap',
    height: '100%',
    minWidth: 0,
  },
  weekday: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: 20,
  },
});
