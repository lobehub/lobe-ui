import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

const bg = `var(--draggable-side-nav-bg, ${cssVar.colorBgLayout})`;
const handleEase = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const styles = stylex.create({
  body: {
    'flexBasis': '0%',
    'flexGrow': 1,
    'flexShrink': 1,
    'scrollBehavior': 'smooth',
    'overflowX': 'hidden',
    'overflowY': 'auto',
    '::-webkit-scrollbar': {
      width: 6,
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: 3,
      backgroundColor: cssVar.colorBorderSecondary,
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    willChange: 'width',
    height: '100%',
  },
  contentContainer: {
    overflow: 'hidden',
    backgroundColor: bg,
    borderInlineEndColor: cssVar.colorBorderSecondary,
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  contentContainerNoBorder: {
    borderInlineEndWidth: 0,
  },
  footer: {
    flexShrink: 0,
  },
  handle: {
    borderColor: cssVar.colorBorder,
    borderStyle: 'solid',
    borderWidth: 1,
    transition: `color 0.2s ${cssVar.motionEaseOut}, transform 0.2s ${cssVar.motionEaseOut}, box-shadow 0.2s ${cssVar.motionEaseOut}`,
    backdropFilter: 'blur(8px)',
    backgroundColor: bg,
    color: {
      'default': cssVar.colorTextTertiary,
      ':hover:not(:active)': cssVar.colorTextSecondary,
      ':active': cssVar.colorText,
    },
    cursor: 'pointer',
    insetBlockStart: '50%',
    marginBlockStart: -27,
    pointerEvents: 'all',
    position: 'absolute',
    transform: { 'default': null, ':active': 'scale(0.95)' },
    height: 54,
    width: 16,
  },
  handleLeft: {
    borderEndEndRadius: cssVar.borderRadiusLG,
    borderEndStartRadius: 0,
    borderInlineStartWidth: 0,
    borderStartEndRadius: cssVar.borderRadiusLG,
    borderStartStartRadius: 0,
    marginInlineStart: -1,
  },
  handleRight: {
    borderEndEndRadius: 0,
    borderEndStartRadius: cssVar.borderRadiusLG,
    borderInlineEndWidth: 0,
    borderStartEndRadius: 0,
    borderStartStartRadius: cssVar.borderRadiusLG,
    marginInlineEnd: -1,
  },
  handlerIcon: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    flexShrink: 0,
  },
  resizeHandle: {
    'insetBlock': 0,
    'transition': 'background-color 0.2s ease',
    'cursor': 'col-resize',
    'position': 'absolute',
    'width': 8,
    '::after': {
      insetBlock: 0,
      transition: `all 0.25s ${handleEase}`,
      backgroundColor: 'transparent',
      content: "''",
      insetInlineStart: '50%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      width: 2,
    },
  },
  resizeHandleHighlight: {
    '::after': {
      insetBlock: 0,
      transition: `all 0.25s ${handleEase}`,
      backgroundColor: {
        'default': 'transparent',
        ':hover:not(:active)': cssVar.colorPrimary,
        ':active': cssVar.colorPrimaryActive,
      },
      boxShadow: {
        'default': null,
        ':hover': `0 0 8px color-mix(in srgb, ${cssVar.colorPrimary} 25%, transparent)`,
      },
      content: "''",
      insetInlineStart: '50%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      width: { 'default': 2, ':hover': 3 },
    },
  },
  resizeHandleLeft: {
    insetInlineEnd: -4,
  },
  resizeHandleRight: {
    insetInlineStart: -4,
  },
  toggleLeft: {
    insetInlineEnd: -16,
    height: '100%',
    width: 16,
  },
  toggleRight: {
    insetInlineStart: -16,
    height: '100%',
    width: 16,
  },
  toggleRoot: {
    transition: `opacity 0.25s ${handleEase}`,
    pointerEvents: { 'default': 'none', ':has(> div)': 'all' },
    position: 'absolute',
    zIndex: 50,
  },
});
