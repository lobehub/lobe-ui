import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const checked = ':is([data-checked], [data-indeterminate]):not([data-disabled])';
const hover = ':hover:not([data-disabled], [data-checked], [data-indeterminate])';
const disabled = ':is([data-disabled])';

export const styles = stylex.create({
  circle: {
    borderRadius: '50%',
  },
  defaultSize: {
    height: 16,
    width: 16,
  },
  defaultSquare: {
    borderRadius: 4,
  },
  group: {
    gap: 12,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupVertical: {
    flexDirection: 'column',
  },
  iconCircle: {
    transform: 'scale(0.66)',
  },
  iconSquare: {
    transform: 'scale(0.75)',
  },
  indicator: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  // Sized to the text's first line (`1lh`) so the box centres on that line, not the whole label.
  control: {
    flex: 'none',
    alignItems: 'center',
    display: 'inline-flex',
    minHeight: '1lh',
  },
  label: {
    gap: 8,
    alignItems: 'flex-start',
    cursor: { 'default': 'pointer', ':has([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    userSelect: 'none',
  },
  root: {
    margin: 0,
    padding: 0,
    borderColor: {
      [checked]: `var(--lobe-checkbox-bg, ${cssVar.colorPrimary})`,
      default: cssVar.colorBorderSecondary,
      [disabled]: cssVar.colorFill,
      [hover]: cssVar.colorBorder,
    },
    borderStyle: 'solid',
    borderWidth: 1,
    flex: 'none',
    outline: 'none',
    transition: `background 150ms ${cssVar.motionEaseOut}, border-color 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: {
      [checked]: `var(--lobe-checkbox-bg, ${cssVar.colorPrimary})`,
      default: cssVar.colorBgContainer,
      [disabled]: cssVar.colorFill,
    },
    color: { default: cssVar.colorBgLayout, [disabled]: cssVar.colorText },
    cursor: { default: 'pointer', [disabled]: 'not-allowed' },
    display: 'inline-flex',
    justifyContent: 'center',
    opacity: { default: null, [disabled]: 0.25 },
  },
});

export const checkboxStyles = {
  circle: stylex.props(styles.circle).className ?? '',
  control: stylex.props(styles.control).className ?? '',
  defaultSize: stylex.props(styles.defaultSize).className ?? '',
  defaultSquare: stylex.props(styles.defaultSquare).className ?? '',
  group: stylex.props(styles.group).className ?? '',
  groupVertical: stylex.props(styles.groupVertical).className ?? '',
  iconCircle: stylex.props(styles.iconCircle).className ?? '',
  iconSquare: stylex.props(styles.iconSquare).className ?? '',
  indicator: stylex.props(styles.indicator).className ?? '',
  label: stylex.props(styles.label).className ?? '',
  root: stylex.props(styles.root).className ?? '',
} satisfies Record<keyof typeof styles, string>;
