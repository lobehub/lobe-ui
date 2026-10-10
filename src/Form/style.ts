import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';

import { formGroupTriggerMarker, formMarker } from './marker.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

export const rootStyles = stylex.create({
  borderless: {
    gap: { default: 48, [media.sm]: '0 !important' },
  },
  root: {
    gap: { default: 16, [media.sm]: '0 !important' },
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
  },
});

export const fieldStyles = stylex.create({
  control: {
    gap: 4,
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 'var(--form-field-min-width, unset)',
  },
  controlVertical: {
    alignItems: 'stretch',
    width: '100%',
  },
  error: {
    color: cssVar.colorError,
    fontSize: 12,
  },
  horizontal: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    flex: '1',
    display: 'block',
    textAlign: 'start',
    maxWidth: '100%',
  },
  root: {
    gap: 12,
    paddingBlock: 16,
    boxSizing: 'border-box',
    display: 'flex',
    width: '100%',
  },
  vertical: {
    gap: 8,
    alignItems: 'stretch',
    flexDirection: 'column',
  },
});

export const fieldLayoutStyles = {
  horizontal: fieldStyles.horizontal,
  vertical: fieldStyles.vertical,
};

export const dividerStyles = stylex.create({
  root: {
    margin: 0,
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 'medium',
    backgroundColor: cssVar.colorBorderSecondary,
    height: 1,
    width: '100%',
  },
});

export const groupStyles = stylex.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
  bodyBoxed: {
    paddingBlock: { default: 16, [stylex.when.ancestor(':is(*)', formMarker)]: 0 },
    paddingInline: 16,
  },
  bodyFilled: {
    borderRadius: cssVar.borderRadius,
    marginInline: 3,
    marginBlockEnd: 3,
  },
  bodyFilledLight: {
    boxShadow: `0 1px 0 -1px ${cssVar.colorBorder}, 0 1px 2px -0.5px ${cssVar.colorBorder}, 0 2px 2px -1px ${cssVar.colorBorderSecondary}, 0 3px 6px -4px ${cssVar.colorBorderSecondary}`,
  },
  chevron: {
    flex: 'none',
    transition: `transform 200ms ${cssVar.motionEaseOut}`,
    color: cssVar.colorTextDescription,
    transform: {
      default: null,
      [stylex.when.ancestor('[data-panel-open]', formGroupTriggerMarker)]: 'rotate(180deg)',
    },
  },
  desc: {
    color: cssVar.colorTextDescription,
    fontSize: 12,
    fontWeight: 400,
  },
  header: {
    gap: 12,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerBorderless: {
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    paddingBlockEnd: 16,
  },
  headerBoxed: {
    padding: 16,
  },
  mobileBody: {
    paddingBlock: 0,
    paddingInline: 16,
    backgroundColor: cssVar.colorBgContainer,
  },
  mobileHeader: {
    padding: 16,
    backgroundColor: cssVar.colorBgLayout,
  },
  mobileTitle: {
    fontSize: 14,
    fontWeight: 400,
    opacity: 0.5,
  },
  panel: {
    overflow: 'hidden',
    transition: `height 200ms ${cssVar.motionEaseOut}`,
    transitionDuration: { default: null, [reducedMotion]: '0s' },
    height: {
      'default': 'var(--collapsible-panel-height)',
      ':is([data-starting-style], [data-ending-style])': 0,
    },
  },
  rootFilled: {
    borderRadius: cssVar.borderRadiusLG,
    backgroundColor: cssVar.colorFillQuaternary,
  },
  rootFilledDark: {
    backgroundColor: cssVar.colorBgLayout,
  },
  rootOutlined: {
    borderRadius: cssVar.borderRadiusLG,
  },
  title: {
    gap: 8,
    alignItems: 'center',
    color: cssVar.colorText,
    display: 'flex',
    flexShrink: 0,
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleBorderless: {
    fontSize: 18,
  },
  trigger: {
    margin: 0,
    padding: 0,
    borderColor: 'currentcolor',
    borderRadius: cssVar.borderRadius,
    borderStyle: 'none',
    borderWidth: 'medium',
    flex: '1',
    gap: 12,
    outline: 'none',
    alignItems: 'center',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    cursor: 'pointer',
    display: 'flex',
    textAlign: 'start',
  },
});

export const flatGroupStyles = stylex.create({
  borderless: {
    paddingInline: 0,
  },
  filled: {
    backgroundColor: cssVar.colorFillQuaternary,
  },
  mobile: {
    borderRadius: 0,
    paddingBlock: 0,
    paddingInline: 16,
    backgroundColor: cssVar.colorBgContainer,
  },
  root: {
    borderRadius: cssVar.borderRadiusLG,
    paddingInline: 16,
  },
});

export const footerStyles = stylex.create({
  root: {
    padding: { default: null, [media.sm]: 16 },
    backgroundColor: { default: null, [media.sm]: cssVar.colorBgContainer },
    borderBlockStartColor: { default: null, [media.sm]: cssVar.colorBorderSecondary },
    borderBlockStartStyle: { default: null, [media.sm]: 'solid' },
    borderBlockStartWidth: { default: null, [media.sm]: 1 },
  },
});

export const submitFooterStyles = stylex.create({
  floatFooter: {
    padding: 8,
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: 48,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgContainer,
    boxShadow: cssVar.boxShadowSecondary,
    insetBlockEnd: 24,
    insetInlineStart: '50%',
    position: 'fixed',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    width: 'max-content',
  },
  footer: {
    padding: { default: null, [media.sm]: 16 },
    backgroundColor: { default: null, [media.sm]: cssVar.colorBgContainer },
    borderBlockStartColor: { default: null, [media.sm]: cssVar.colorBorderSecondary },
    borderBlockStartStyle: { default: null, [media.sm]: 'solid' },
    borderBlockStartWidth: { default: null, [media.sm]: 1 },
    marginBlockStart: { default: null, [media.sm]: `calc(-1 * ${cssVar.borderRadius})` },
  },
});

export const titleStyles = stylex.create({
  content: {
    position: 'relative',
    textAlign: 'start',
  },
  desc: {
    color: cssVar.colorTextDescription,
    display: 'block',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.44,
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  title: {
    color: cssVar.colorText,
    fontWeight: 500,
    lineHeight: 1,
  },
});
