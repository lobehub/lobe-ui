import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const size = 'var(--color-swatches-size, 24px)';
const containerHover = `inset 0 0 0 1px rgb(0 0 0 / 5%), 0 0 0 2px ${cssVar.colorText}`;
const pickerHover = `inset 0 0 0 1px ${cssVar.colorFillSecondary}, 0 0 0 2px ${cssVar.colorText}`;

export const styles = stylex.create({
  activeContainer: {
    boxShadow: { 'default': `inset 0 0 0 1px ${cssVar.colorFill}`, ':hover': containerHover },
  },
  activePicker: {
    boxShadow: { 'default': `inset 0 0 0 1px ${cssVar.colorFill}`, ':hover': pickerHover },
  },
  conic: {
    backgroundColor: 'transparent',
    backgroundImage: `conic-gradient(${cssVar.red}, ${cssVar.volcano}, ${cssVar.orange}, ${cssVar.gold}, ${cssVar.yellow}, ${cssVar.lime}, ${cssVar.green}, ${cssVar.cyan}, ${cssVar.blue}, ${cssVar.geekblue}, ${cssVar.purple}, ${cssVar.magenta}, ${cssVar.red})`,
  },
  container: {
    flex: 'none',
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: {
      'default': `inset 0 0 0 1px ${cssVar.colorFillSecondary}`,
      ':hover': containerHover,
    },
    cursor: 'pointer',
    height: size,
    minHeight: size,
    minWidth: size,
    width: size,
  },
  picker: {
    padding: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    flex: 'none',
    overflow: 'hidden',
    boxShadow: { 'default': `inset 0 0 0 1px ${cssVar.colorFillSecondary}`, ':hover': pickerHover },
    cursor: 'pointer',
    height: size,
    minHeight: size,
    minWidth: size,
    width: size,
  },
  transparent: {
    backgroundImage: `conic-gradient(${cssVar.colorFillSecondary} 25%, transparent 25% 50%, ${cssVar.colorFillSecondary} 50% 75%, transparent 75% 100%)`,
    backgroundSize: '50% 50%',
  },
});
