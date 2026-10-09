import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const checker = `linear-gradient(45deg, ${cssVar.colorFillSecondary} 25%, transparent 25%, transparent 75%, ${cssVar.colorFillSecondary} 75%)`;

export const styles = stylex.create({
  alphaField: {
    flex: 'none',
    width: '76px !important',
  },
  alphaTrack: {
    backgroundPosition: '0 0, 0 0, 4px 4px !important',
    borderRadius: '999px !important',
    backgroundImage: `linear-gradient(to right, transparent, var(--lobe-color-picker-alpha)), ${checker}, ${checker} !important`,
    backgroundSize: '100% 100%, 8px 8px, 8px 8px !important',
    height: '10px !important',
  },
  eyeDropper: {
    marginInlineStart: 'auto',
  },
  hexField: {
    minWidth: 0,
  },
  hexRow: {
    gap: 6,
    display: 'flex',
  },
  hidden: {
    backgroundColor: 'transparent !important',
    backgroundImage: 'none !important',
  },
  hueTrack: {
    borderRadius: '999px !important',
    backgroundColor: 'transparent !important',
    backgroundImage:
      'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00) !important',
    height: '10px !important',
  },
  panel: {
    gap: 14,
    display: 'flex',
    flexDirection: 'column',
    width: 240,
  },
  preset: {
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: '50%',
    borderStyle: 'none',
    borderWidth: 0,
    boxShadow: {
      'default': null,
      ":is([aria-pressed='true'])": `0 0 0 2px ${cssVar.colorBgElevated}, 0 0 0 4px ${cssVar.colorText}`,
    },
    cursor: 'pointer',
    height: 22,
    width: 22,
  },
  presets: {
    gap: 8,
    borderBlockStartColor: cssVar.colorBorderSecondary,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    paddingBlockStart: 14,
  },
  saturation: {
    borderRadius: 12,
    cursor: 'crosshair',
    position: 'relative',
    touchAction: 'none',
    height: 164,
  },
  sliderThumb: {
    borderColor: '#fff !important',
    borderStyle: 'solid',
    borderWidth: '3px !important',
    backgroundColor: 'transparent !important',
    backgroundImage: 'none !important',
    boxShadow: '0 0 0 1px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 25%) !important',
    height: '18px !important',
    width: '18px !important',
  },
  summary: {
    gap: 12,
    alignItems: 'center',
    display: 'flex',
  },
  swatch: {
    backgroundPosition: '0 0, 4px 4px',
    borderRadius: '50%',
    flex: 'none',
    overflow: 'hidden',
    backgroundImage: `${checker}, ${checker}`,
    backgroundSize: '8px 8px',
    boxShadow: `inset 0 0 0 1px ${cssVar.colorFillSecondary}`,
    display: 'inline-flex',
  },
  swatchButton: {
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: '50%',
    borderStyle: 'none',
    borderWidth: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    cursor: { 'default': 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    justifyContent: 'center',
    opacity: { 'default': null, ':disabled': 0.5 },
    height: 32,
    width: 32,
  },
  swatchFill: {
    flex: '1',
  },
  textTrigger: {
    width: 'auto',
  },
  thumb: {
    borderColor: '#fff',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 3,
    boxShadow: '0 0 0 1px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 25%)',
    boxSizing: 'border-box',
    marginBlockEnd: 0,
    marginBlockStart: -9,
    marginInlineEnd: 0,
    marginInlineStart: -9,
    position: 'absolute',
    height: 18,
    width: 18,
  },
  value: {
    fontFamily: cssVar.fontFamilyCode,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 1.2,
  },
});
