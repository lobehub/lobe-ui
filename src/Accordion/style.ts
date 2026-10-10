import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

import {
  accordionHeaderMarker,
  accordionPanelMarker,
  accordionTriggerMarker,
} from './marker.stylex';

const reducedMotion = '@media (prefers-reduced-motion: reduce)';
const animationNone = ':is([style*="animation-name: none"], [style*="animation-name:none"])';
const startingStyle =
  ':is([data-starting-style]):not([style*="animation-name: none"], [style*="animation-name:none"])';
const endingStyle =
  ':is([data-ending-style]):not([style*="animation-name: none"], [style*="animation-name:none"])';
const startingAnimationNone =
  ':is([data-starting-style]):is([style*="animation-name: none"], [style*="animation-name:none"])';
const enabledHover = ':hover:not(:has([data-disabled]))';

export const styles = stylex.create({
  action: {
    gap: 4,
    transition: `opacity 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    opacity: {
      default: 0,
      [stylex.when.ancestor(':focus-within', accordionHeaderMarker)]: 1,
      [stylex.when.ancestor(':hover', accordionHeaderMarker)]: 1,
    },
  },
  actionAlwaysVisible: {
    opacity: 1,
  },
  actionBorderless: {
    paddingInlineEnd: 'var(--accordion-hover-inset, 8px)',
  },
  actionOutlined: {
    paddingInlineEnd: 16,
  },
  content: {
    transition: `opacity 200ms ${cssVar.motionEaseOut}, translate 200ms ${cssVar.motionEaseOut}`,
    fontSize: 14,
    lineHeight: 1.6,
    opacity: {
      default: null,
      [stylex.when.ancestor(startingStyle, accordionPanelMarker)]: 0,
      [stylex.when.ancestor(endingStyle, accordionPanelMarker)]: 0,
      [stylex.when.ancestor(animationNone, accordionPanelMarker)]: 1,
    },
    transitionDuration: {
      default: null,
      [reducedMotion]: '0s',
      [stylex.when.ancestor(animationNone, accordionPanelMarker)]: '0s',
    },
    transitionProperty: {
      default: null,
      [stylex.when.ancestor(animationNone, accordionPanelMarker)]: 'none',
    },
    transitionTimingFunction: {
      default: null,
      [stylex.when.ancestor(animationNone, accordionPanelMarker)]: 'ease',
    },
    translate: {
      default: null,
      [stylex.when.ancestor(startingStyle, accordionPanelMarker)]: '0 6px',
      [stylex.when.ancestor(endingStyle, accordionPanelMarker)]: '0 -6px',
      [stylex.when.ancestor(animationNone, accordionPanelMarker)]: 'none',
    },
  },
  contentBorderless: {
    paddingBlockEnd: 12,
    paddingBlockStart: 0,
  },
  contentIndent: {
    paddingInlineStart: 24,
  },
  contentIndentOutlined: {
    paddingInlineStart: 40,
  },
  contentInline: {
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
  },
  contentOutlined: {
    paddingInline: 16,
    paddingBlockEnd: 14,
    paddingBlockStart: 4,
  },
  header: {
    margin: 0,
    transition: `background 150ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    backgroundColor: {
      default: null,
      [enabledHover]: cssVar.colorFillTertiary,
    },
    display: 'flex',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    position: 'relative',
  },
  headerBorderless: {
    borderRadius: cssVar.borderRadius,
    marginInline: 'calc(var(--accordion-hover-inset,8px) * -1)',
  },
  headerFilled: {
    borderRadius: cssVar.borderRadius,
    backgroundColor: {
      default: cssVar.colorFillTertiary,
      [enabledHover]: cssVar.colorFillSecondary,
    },
  },
  headerInline: {
    marginInline: 0,
  },
  indicator: {
    transition: `transform 200ms ${cssVar.motionEaseOut}`,
    alignItems: 'center',
    color: cssVar.colorTextDescription,
    display: 'flex',
    flexShrink: 0,
    transitionDuration: { default: null, [reducedMotion]: '0s' },
  },
  indicatorEnd: {
    marginInlineStart: 'auto',
    transform: {
      default: null,
      [stylex.when.ancestor('[data-panel-open]', accordionTriggerMarker)]: 'rotate(180deg)',
    },
  },
  indicatorInline: {
    justifyContent: 'center',
    marginInlineStart: -6,
    transform: {
      default: null,
      [stylex.when.ancestor('[data-panel-open]', accordionTriggerMarker)]: 'rotate(90deg)',
    },
    height: 18,
    width: 18,
  },
  indicatorStart: {
    transform: {
      default: null,
      [stylex.when.ancestor('[data-panel-open]', accordionTriggerMarker)]: 'rotate(90deg)',
    },
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemOutlined: {
    borderBlockStartColor: { 'default': null, ':not(:first-child)': cssVar.colorBorderSecondary },
    borderBlockStartStyle: { 'default': null, ':not(:first-child)': 'solid' },
    borderBlockStartWidth: { 'default': null, ':not(:first-child)': 1 },
  },
  panel: {
    interpolateSize: 'allow-keywords',
    overflow: 'hidden',
    transition: `height 200ms ${cssVar.motionEaseOut}`,
    transitionDuration: {
      default: null,
      [reducedMotion]: '0s',
      [startingAnimationNone]: '0s',
    },
    transitionProperty: {
      default: null,
      [startingAnimationNone]: 'none',
    },
    transitionTimingFunction: {
      default: null,
      [startingAnimationNone]: 'ease',
    },
    height: {
      'default': 'auto',
      [startingStyle]: 0,
      ':is([data-ending-style])': 0,
    },
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  rootOutlined: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
  trigger: {
    font: 'inherit',
    borderColor: 'currentcolor',
    borderRadius: 'inherit',
    borderStyle: 'none',
    borderWidth: 0,
    flex: '1',
    gap: 8,
    outline: 'none',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: { 'default': cssVar.colorText, ':is([data-disabled])': cssVar.colorTextDisabled },
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'flex',
    fontSize: 14,
    textAlign: 'start',
    userSelect: 'none',
    minWidth: 0,
  },
  triggerBorderless: {
    paddingBlock: 8,
    paddingInline: 'var(--accordion-hover-inset,8px)',
  },
  triggerFilled: {
    paddingBlock: 8,
    paddingInline: 16,
  },
  triggerOutlined: {
    paddingBlock: 12,
    paddingInline: 16,
    paddingBlockEnd: { 'default': null, ':is([data-panel-open])': 8 },
  },
});

const classNames = Object.fromEntries(
  Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
) as Record<keyof typeof styles, string>;

export const accordionStyles = {
  ...classNames,
  panel: stylex.props(accordionPanelMarker, styles.panel).className ?? '',
};
