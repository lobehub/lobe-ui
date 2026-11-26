import * as stylex from '@stylexjs/stylex';

import { a2ui } from './tokens.stylex';

/**
 * Shared atoms of the `a2ui` variants: the card, the well, the context label and the tone
 * tints. Adapted from CopilotKit a2ui-playground (MIT), `globals.css` `.a2-card` / `.a2-well` /
 * `.a2-label` and the renderers' `TONE` map.
 */
export const a2uiStyles = stylex.create({
  /** Typography baseline every a2ui root sets, so it does not inherit the host's. */
  base: {
    color: a2ui.fg,
    fontFamily: a2ui.fontFamily,
    fontFeatureSettings: 'normal',
    // The playground sets no text-rendering / kerning; lobe-ui's body opts into both, which
    // tightens Geist and changes where text wraps.
    fontKerning: 'auto',
    fontVariantNumeric: 'normal',
    letterSpacing: 'normal',
    lineHeight: 1.5,
    textRendering: 'auto',
  },
  /** `.a2-card`: surface, 1px hairline, 14px radius, soft shadow (dark: inset highlight + sheen). */
  card: {
    borderColor: a2ui.line,
    borderRadius: a2ui.radius,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: a2ui.surface,
    backgroundImage: `linear-gradient(180deg, ${a2ui.cardSheen}, transparent 40%)`,
    boxShadow: a2ui.cardShadow,
  },
  /** `.a2-label`: a heading's muted context line (12.5px / 500). */
  label: {
    color: a2ui.fgMuted,
    fontSize: 12.5,
    fontWeight: 500,
  },
  tabular: {
    fontVariantNumeric: 'tabular-nums',
  },
  /** Card title (`h3`, 13px / 600, tight). */
  title: {
    margin: 0,
    overflow: 'hidden',
    color: a2ui.fg,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '-0.025em',
    lineHeight: 1.5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  /** `.a2-well`: inset panel inside a card. */
  well: {
    borderColor: a2ui.line,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: a2ui.ink3,
  },
});

/**
 * Soft tint per tone, from the lobe-ui fill tokens a filled `Tag` uses (tertiary wash, secondary
 * hairline, the tone's text colour). The accent tone takes the `purple` preset palette.
 */
export const a2uiToneSoft = stylex.create({
  accent: {
    borderColor: 'var(--lobe-purple-fill-secondary)',
    backgroundColor: 'var(--lobe-purple-fill-tertiary)',
    color: 'var(--lobe-purple-active)',
  },
  default: {
    borderColor: a2ui.overlay8,
    backgroundColor: a2ui.overlay6,
    color: a2ui.fg85,
  },
  info: {
    borderColor: 'var(--lobe-color-info-fill-secondary)',
    backgroundColor: 'var(--lobe-color-info-fill-tertiary)',
    color: 'var(--lobe-color-info-text)',
  },
  negative: {
    borderColor: 'var(--lobe-color-error-fill-secondary)',
    backgroundColor: 'var(--lobe-color-error-fill-tertiary)',
    color: 'var(--lobe-color-error-text)',
  },
  positive: {
    borderColor: 'var(--lobe-color-success-fill-secondary)',
    backgroundColor: 'var(--lobe-color-success-fill-tertiary)',
    color: 'var(--lobe-color-success-text)',
  },
  warning: {
    borderColor: 'var(--lobe-color-warning-fill-secondary)',
    backgroundColor: 'var(--lobe-color-warning-fill-tertiary)',
    color: 'var(--lobe-color-warning-text)',
  },
});

/** Tone as a text colour (`default` is the muted foreground). */
export const a2uiToneText = stylex.create({
  accent: { color: 'var(--lobe-color-primary-text)' },
  default: { color: a2ui.fgMuted },
  info: { color: 'var(--lobe-color-info-text)' },
  negative: { color: 'var(--lobe-color-error-text)' },
  positive: { color: 'var(--lobe-color-success-text)' },
  warning: { color: 'var(--lobe-color-warning-text)' },
});

/** Tone as a fill (dots, bars). */
export const a2uiToneFill = stylex.create({
  accent: { backgroundColor: a2ui.accent },
  default: { backgroundColor: a2ui.fgMuted },
  info: { backgroundColor: a2ui.info },
  negative: { backgroundColor: a2ui.negative },
  positive: { backgroundColor: a2ui.positive },
  warning: { backgroundColor: a2ui.warning },
});
