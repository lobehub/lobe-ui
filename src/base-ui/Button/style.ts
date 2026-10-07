import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const buttonPaddingInline = {
  large: 16,
  middle: 14,
  small: 8,
} as const;

const disabled = ':is(:disabled, [aria-disabled="true"])';
const hover = ':hover:not(:disabled, [aria-disabled="true"])';
const active = ':active:not(:disabled, [aria-disabled="true"])';
const hoverIdle = ':hover:not(:active, :disabled, [aria-disabled="true"])';
const hoverIdleClosed = ':hover:not(:active, :disabled, [aria-disabled="true"], [data-popup-open])';
const popupOpen = ':is([data-popup-open])';

const spin = stylex.keyframes({
  to: { transform: 'rotate(360deg)' },
});

const ease = 'cubic-bezier(0.32, 0.72, 0, 1)';
const slotEase = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const styles = stylex.create({
  base: {
    borderColor: cssVar.colorBorder,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 6,
    textDecoration: 'none',
    transition: `color 160ms ${ease}, background 160ms ${ease}, border-color 160ms ${ease}, box-shadow 160ms ${ease}`,
    alignItems: 'center',
    boxSizing: 'border-box',
    cursor: { default: 'pointer', [disabled]: 'not-allowed' },
    display: 'inline-flex',
    fontWeight: 500,
    justifyContent: 'center',
    lineHeight: 1,
    opacity: { default: null, [disabled]: 0.5 },
    pointerEvents: { default: null, [disabled]: 'none' },
    position: 'relative',
    whiteSpace: 'nowrap',
  },

  sizeSmall: {
    '--button-padding-inline': `${buttonPaddingInline.small}px`,
    'borderRadius': cssVar.borderRadiusSM,
    'paddingInline': 'var(--button-padding-inline)',
    'fontSize': 12,
    'height': 24,
  },

  sizeMiddle: {
    '--button-padding-inline': `${buttonPaddingInline.middle}px`,
    'borderRadius': cssVar.borderRadiusSM,
    'paddingInline': 'var(--button-padding-inline)',
    'fontSize': 13,
    'height': 32,
  },

  sizeLarge: {
    '--button-padding-inline': `${buttonPaddingInline.large}px`,
    'borderRadius': cssVar.borderRadius,
    'paddingInline': 'var(--button-padding-inline)',
    'fontSize': 14,
    'height': 40,
  },

  outdentStart: {
    marginInlineStart: 'calc(var(--button-padding-inline) * -1)',
  },

  outdentEnd: {
    marginInlineEnd: 'calc(var(--button-padding-inline) * -1)',
  },

  shapeCircle: {
    borderRadius: '50%',
    paddingInline: 0,
  },

  shapeRound: {
    borderRadius: 999,
  },

  block: {
    width: '100%',
  },

  iconEnd: {
    flexDirection: 'row-reverse',
  },

  iconOnlySmall: {
    '--button-padding-inline': '0px',
    'paddingInline': 0,
    'width': 24,
  },

  iconOnlyMiddle: {
    '--button-padding-inline': '0px',
    'paddingInline': 0,
    'width': 32,
  },

  iconOnlyLarge: {
    '--button-padding-inline': '0px',
    'paddingInline': 0,
    'width': 40,
  },

  iconBox: {
    alignItems: 'center',
    display: 'inline-flex',
    justifyContent: 'center',
  },

  spinnerSlot: {
    overflow: 'hidden',
    transition: `width 380ms ${slotEase}, margin 380ms ${slotEase}, opacity 260ms ${slotEase}`,
    marginInlineEnd: -6,
    opacity: 0,
    width: 0,
  },

  spinnerSlotEnd: {
    marginInlineEnd: 0,
    marginInlineStart: -6,
  },

  spinnerSlotShow: {
    marginInlineEnd: 0,
    marginInlineStart: 0,
    opacity: 1,
    width: 12,
  },

  variantDefault: {
    borderColor: { default: cssVar.colorBorder, [hover]: cssVar.colorPrimaryBorder },
    backgroundColor: cssVar.colorBgContainer,
    color: { default: cssVar.colorText, [hover]: cssVar.colorPrimaryText },
  },

  variantPrimary: {
    borderColor: {
      [active]: cssVar.colorPrimaryActive,
      default: cssVar.colorPrimary,
      [hoverIdleClosed]: cssVar.colorPrimaryHover,
      [popupOpen]: cssVar.colorPrimaryActive,
    },
    backgroundColor: {
      [active]: cssVar.colorPrimaryActive,
      default: cssVar.colorPrimary,
      [hoverIdleClosed]: cssVar.colorPrimaryHover,
      [popupOpen]: cssVar.colorPrimaryActive,
    },
    color: cssVar.colorBgLayout,
  },

  variantDashed: {
    borderColor: { default: cssVar.colorBorder, [hover]: cssVar.colorPrimaryBorder },
    borderStyle: 'dashed',
    backgroundColor: cssVar.colorBgContainer,
    color: { default: cssVar.colorText, [hover]: cssVar.colorPrimaryText },
  },

  variantFill: {
    borderColor: 'transparent',
    backgroundColor: {
      [active]: cssVar.colorFill,
      default: cssVar.colorFillTertiary,
      [hoverIdle]: cssVar.colorFillSecondary,
    },
    color: cssVar.colorText,
  },

  variantText: {
    borderColor: 'transparent',
    backgroundColor: { default: 'transparent', [hover]: cssVar.colorFillSecondary },
    color: cssVar.colorText,
  },

  variantLink: {
    borderColor: 'transparent',
    paddingInline: 0,
    backgroundColor: 'transparent',
    color: { default: cssVar.colorPrimary, [hover]: cssVar.colorPrimaryHover },
  },

  dangerOutlined: {
    borderColor: { default: cssVar.colorError, [hover]: cssVar.colorErrorHover },
    backgroundColor: cssVar.colorBgContainer,
    color: { default: cssVar.colorError, [hover]: cssVar.colorErrorHover },
  },

  dangerSolid: {
    borderColor: {
      [active]: cssVar.colorErrorActive,
      default: cssVar.colorError,
      [hoverIdleClosed]: cssVar.colorErrorHover,
      [popupOpen]: cssVar.colorErrorActive,
    },
    backgroundColor: {
      [active]: cssVar.colorErrorActive,
      default: cssVar.colorError,
      [hoverIdleClosed]: cssVar.colorErrorHover,
      [popupOpen]: cssVar.colorErrorActive,
    },
    color: cssVar.colorBgLayout,
  },

  dangerFill: {
    borderColor: 'transparent',
    backgroundColor: {
      [active]: cssVar.colorErrorBgHover,
      default: cssVar.colorErrorBg,
      [hover]: cssVar.colorErrorBgHover,
    },
    color: {
      [active]: cssVar.colorErrorActive,
      default: cssVar.colorError,
      [hoverIdle]: cssVar.colorErrorHover,
    },
  },

  dangerInline: {
    color: { default: cssVar.colorError, [hover]: cssVar.colorErrorHover },
  },

  ghostDefault: {
    borderColor: 'transparent',
    backgroundColor: {
      [active]: cssVar.colorFill,
      default: 'transparent',
      [hoverIdle]: cssVar.colorFillSecondary,
    },
    color: cssVar.colorText,
  },

  ghostPrimary: {
    borderColor: 'transparent',
    backgroundColor: {
      [active]: cssVar.colorFill,
      default: 'transparent',
      [hoverIdle]: cssVar.colorFillSecondary,
    },
    color: {
      [active]: cssVar.colorPrimaryActive,
      default: cssVar.colorPrimary,
      [hoverIdle]: cssVar.colorPrimaryHover,
    },
  },

  ghostDanger: {
    borderColor: 'transparent',
    backgroundColor: {
      [active]: cssVar.colorFill,
      default: 'transparent',
      [hoverIdle]: cssVar.colorFillSecondary,
    },
    color: {
      [active]: cssVar.colorErrorActive,
      default: cssVar.colorError,
      [hoverIdle]: cssVar.colorErrorHover,
    },
  },

  spinner: {
    borderColor: 'currentcolor',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1.5,
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
    borderBlockStartColor: 'transparent',
    display: 'inline-block',
    height: 12,
    width: 12,
  },
});

const hasHover = ':has(> :where(button, a):hover:not(:disabled, [aria-disabled="true"]))';
const hasActive = ':has(> :where(button, a):active:not(:disabled, [aria-disabled="true"]))';
const hasHoverOnly = `${hasHover}:not(${hasActive})`;
const first = ':first-of-type';
const last = ':last-of-type';

export const splitStyles = stylex.create({
  root: {
    display: 'inline-flex',
    flexDirection: 'row',
  },
  interactionDisabled: {
    opacity: 0.5,
  },
  solidPrimary: {
    '--lobe-split-button-fill': {
      default: null,
      [hasActive]: cssVar.colorPrimaryActive,
      [hasHoverOnly]: cssVar.colorPrimaryHover,
    },
  },
  solidDanger: {
    '--lobe-split-button-fill': {
      default: null,
      [hasActive]: cssVar.colorErrorActive,
      [hasHoverOnly]: cssVar.colorErrorHover,
    },
  },
  item: {
    borderEndEndRadius: { default: null, [first]: 0 },
    borderEndStartRadius: { default: null, [last]: 0 },
    borderStartEndRadius: { default: null, [first]: 0 },
    borderStartStartRadius: { default: null, [last]: 0 },
    marginInlineStart: { default: null, [last]: -1 },
  },
  itemInteractionDisabled: {
    opacity: { default: null, [disabled]: 1 },
  },
  itemSolid: {
    '::before': {
      insetBlock: { default: null, [last]: 0 },
      backgroundColor: { default: null, [last]: 'currentcolor' },
      content: { default: null, [last]: "''" },
      insetInlineStart: { default: null, [last]: 0 },
      opacity: { default: null, [last]: 0.2 },
      pointerEvents: { default: null, [last]: 'none' },
      position: { default: null, [last]: 'absolute' },
      width: { default: null, [last]: 1 },
    },
  },
  itemSolidPrimary: {
    borderColor: {
      default: `var(--lobe-split-button-fill, ${cssVar.colorPrimary})`,
      [popupOpen]: cssVar.colorPrimaryActive,
    },
    backgroundColor: {
      default: `var(--lobe-split-button-fill, ${cssVar.colorPrimary})`,
      [popupOpen]: cssVar.colorPrimaryActive,
    },
  },
  itemSolidDanger: {
    borderColor: {
      default: `var(--lobe-split-button-fill, ${cssVar.colorError})`,
      [popupOpen]: cssVar.colorErrorActive,
    },
    backgroundColor: {
      default: `var(--lobe-split-button-fill, ${cssVar.colorError})`,
      [popupOpen]: cssVar.colorErrorActive,
    },
  },
});

export const buttonStyles = Object.fromEntries(
  Object.entries(styles).map(([key, value]) => [key, stylex.props(value).className ?? '']),
) as Record<keyof typeof styles, string>;
