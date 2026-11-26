import * as stylex from '@stylexjs/stylex';

/**
 * Roles the `a2ui` variants read. Every colour is a lobe-ui theme token (`--lobe-*`, light and
 * dark from `theme.css`), so the a2ui look shares one colour scheme with the default variants;
 * only the card geometry and shadow come from `src/styles/theme/a2ui.ts` (`--lobe-a2ui-*`).
 * Role names follow CopilotKit a2ui-playground (MIT), whose layout the variants reproduce.
 */
export const a2ui = stylex.defineConsts({
  /** Live / highlighted accent (official violet) */
  accent: 'var(--lobe-color-primary)',
  alertErrorBase: 'var(--lobe-color-error)',
  alertErrorIcon: 'var(--lobe-color-error)',
  alertErrorText: 'var(--lobe-color-error-text)',
  alertInfoBase: 'var(--lobe-color-info)',
  alertInfoIcon: 'var(--lobe-color-info)',
  alertInfoText: 'var(--lobe-color-info-text)',
  alertSuccessBase: 'var(--lobe-color-success)',
  alertSuccessIcon: 'var(--lobe-color-success)',
  alertSuccessText: 'var(--lobe-color-success-text)',
  alertWarningBase: 'var(--lobe-color-warning)',
  alertWarningIcon: 'var(--lobe-color-warning)',
  alertWarningText: 'var(--lobe-color-warning-text)',
  /**
   * Initials avatar tint: a preset palette step the avatar sets inline
   * (`--lobe-a2ui-tint-bg` / `--lobe-a2ui-tint-fg`, e.g. `var(--lobe-cyan-3)`).
   */
  avatarTintBg: 'var(--lobe-a2ui-tint-bg, var(--lobe-color-fill-secondary))',
  avatarTintFg: 'var(--lobe-a2ui-tint-fg, var(--lobe-color-text))',
  bg: 'var(--lobe-color-bg-layout)',
  calloutIcon: 'var(--lobe-color-primary-text)',
  cardShadow: 'var(--lobe-a2ui-card-shadow)',
  cardSheen: 'var(--lobe-a2ui-card-sheen)',
  fg: 'var(--lobe-color-text)',
  /** `text-foreground/65` */
  fg65: 'color-mix(in srgb, var(--lobe-color-text) 65%, transparent)',
  /** `text-foreground/80` */
  fg80: 'color-mix(in srgb, var(--lobe-color-text) 80%, transparent)',
  /** `text-foreground/85` */
  fg85: 'color-mix(in srgb, var(--lobe-color-text) 85%, transparent)',
  /** `text-foreground/90` */
  fg90: 'color-mix(in srgb, var(--lobe-color-text) 90%, transparent)',
  fgMuted: 'var(--lobe-color-text-secondary)',
  /** `bg-muted-foreground/40` */
  fgMuted40: 'color-mix(in srgb, var(--lobe-color-text-secondary) 40%, transparent)',
  /** `text-muted-foreground/80` */
  fgMuted80: 'color-mix(in srgb, var(--lobe-color-text-secondary) 80%, transparent)',
  fontFamily: 'var(--lobe-font-family)',
  fontFamilyCode: 'var(--lobe-font-family-code)',
  info: 'var(--lobe-color-info)',
  input: 'var(--lobe-color-border)',
  inputBg: 'var(--lobe-color-bg-container)',
  /** Wells */
  ink3: 'var(--lobe-color-fill-tertiary)',
  line: 'var(--lobe-color-border-secondary)',
  lineStrong: 'var(--lobe-color-border)',
  muted: 'var(--lobe-color-fill-tertiary)',
  negative: 'var(--lobe-color-error)',
  /** Text on a solid tone fill */
  onSolid: 'var(--lobe-color-bg-layout)',
  overlay1_5: 'var(--lobe-color-fill-quaternary)',
  overlay2: 'var(--lobe-color-fill-quaternary)',
  overlay2_5: 'var(--lobe-color-fill-quaternary)',
  overlay4: 'var(--lobe-color-fill-tertiary)',
  overlay5: 'var(--lobe-color-fill-tertiary)',
  overlay6: 'var(--lobe-color-fill-tertiary)',
  overlay7: 'var(--lobe-color-fill-secondary)',
  overlay8: 'var(--lobe-color-fill-secondary)',
  overlay12: 'var(--lobe-color-fill)',
  overlay14: 'var(--lobe-color-fill)',
  overlay15: 'var(--lobe-color-fill)',
  positive: 'var(--lobe-color-success)',
  primary: 'var(--lobe-color-primary)',
  /** Text on the primary button (lobe `Button type="primary"`) */
  primaryFg: 'var(--lobe-color-bg-layout)',
  radius: 'var(--lobe-a2ui-radius)',
  ring: 'var(--lobe-color-primary-border)',
  secondary: 'var(--lobe-color-fill-tertiary)',
  surface: 'var(--lobe-color-bg-container)',
  surface2: 'var(--lobe-color-bg-elevated)',
  warning: 'var(--lobe-color-warning)',
});
