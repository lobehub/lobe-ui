import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  colorDashed: {
    color: cssVar.colorTextTertiary,
  },
  colorDefault: {
    color: cssVar.colorTextQuaternary,
  },
  description: {
    maxWidth: '34ch',
  },
  descriptionPage: {
    maxWidth: '52ch',
  },
  title: {
    marginBottom: 0,
    marginTop: 8,
  },
  titleDashed: {
    marginTop: 6,
  },
  titlePage: {
    marginBottom: 4,
    marginTop: 0,
  },
  action: {
    marginBlockStart: 8,
  },
  dashed: {
    borderColor: cssVar.colorBorder,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingBlock: 24,
    paddingInline: 16,
  },
  dashedClickable: {
    borderColor: { 'default': cssVar.colorBorder, ':hover': cssVar.colorTextTertiary },
    transition: 'border-color 0.15s, background 0.15s',
    backgroundColor: { 'default': null, ':hover': cssVar.colorFillQuaternary },
    cursor: 'pointer',
  },
  extraPage: {
    gap: 8,
    display: 'flex',
    marginBlockStart: 14,
  },
  root: {
    gap: 4,
    paddingBlock: 16,
    paddingInline: 8,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  rootPage: {
    padding: 8,
    gap: 20,
    alignItems: 'flex-start',
    display: 'flex',
  },
});
