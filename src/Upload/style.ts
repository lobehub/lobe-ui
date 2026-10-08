import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  dragger: {
    borderColor: { 'default': cssVar.colorBorder, ':hover': cssVar.colorTextTertiary },
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: 6,
    outline: { 'default': null, ':focus-visible': `2px solid ${cssVar.colorPrimary}` },
    paddingBlock: 28,
    paddingInline: 20,
    transition: 'border-color 0.15s, background 0.15s',
    alignItems: 'center',
    backgroundColor: { 'default': cssVar.colorFillQuaternary, ':hover': cssVar.colorFillTertiary },
    cursor: { 'default': 'pointer', ':is([aria-disabled="true"])': 'not-allowed' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    opacity: { 'default': null, ':is([aria-disabled="true"])': 0.5 },
    outlineOffset: { 'default': null, ':focus-visible': 2 },
    textAlign: 'center',
  },
  draggerDescription: {
    color: cssVar.colorTextTertiary,
    fontSize: 12,
  },
  draggerIcon: {
    color: cssVar.colorTextTertiary,
  },
  draggerOver: {
    borderColor: cssVar.colorTextTertiary,
    backgroundColor: cssVar.colorFillTertiary,
  },
  draggerTitle: {
    color: cssVar.colorText,
    fontWeight: 500,
  },
  trigger: {
    outline: { 'default': null, ':focus-visible': `2px solid ${cssVar.colorPrimary}` },
    cursor: { 'default': 'pointer', ':is([aria-disabled="true"])': 'not-allowed' },
    display: 'inline-block',
    opacity: { 'default': null, ':is([aria-disabled="true"])': 0.5 },
    outlineOffset: { 'default': null, ':focus-visible': 2 },
  },
});
