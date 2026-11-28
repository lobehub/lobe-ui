import type { LobeAppearance } from './scope';

/**
 * Non-colour card tokens of the `a2ui` variants, emitted into `theme.css` as `--lobe-a2ui-*` next
 * to each appearance's other variables. Colours are not here: the variants take every colour from
 * the lobe-ui tokens (see `@/internal/a2ui/tokens.stylex`), and the shadows below are mixed from
 * `--lobe-color-text` so they follow the theme too.
 *
 * Geometry and shadow structure adapted from CopilotKit a2ui-playground (MIT), `.a2-card`: a
 * 14px radius, a soft two-layer shadow in light, an inset top highlight and a 2.2% sheen in dark.
 * `shadow-sm` / `shadow-md` are the standard catalog's floating shadows (carousel arrows, popovers,
 * tooltips) and `shadow-xs` its control shadow (slider thumb, selected segment): black at 12% / 8% /
 * 12% in light, 50% / 40% / 50% in dark.
 *
 * The surfaces are steps of the theme's own backgrounds, so a card always reads one step above the
 * floor it stands on, whatever the host's background is: in dark the floor is `colorBgContainer`
 * with a 2.5% text tint, a card `colorBgElevated` and a control or popover on a card a step above
 * that (official dark: floor 0.145, card 0.172, surface-2 0.205 L). In light the floor is a 2.5% tint
 * over the host and cards are `colorBgContainer`, as before. Inputs take a 3% wash in dark
 * (`bg-input/30`) instead of the darker container colour.
 */
export const a2uiTokens: Record<LobeAppearance, Record<string, string>> = {
  dark: {
    '--lobe-a2ui-floor':
      'color-mix(in srgb, var(--lobe-color-text) 2.5%, var(--lobe-color-bg-container))',
    '--lobe-a2ui-input-bg': 'color-mix(in srgb, var(--lobe-color-text) 3%, transparent)',
    '--lobe-a2ui-surface': 'var(--lobe-color-bg-elevated)',
    '--lobe-a2ui-surface-2':
      'color-mix(in srgb, var(--lobe-color-text) 6%, var(--lobe-color-bg-elevated))',
    '--lobe-a2ui-card-shadow':
      'inset 0 1px 0 color-mix(in srgb, var(--lobe-color-text) 4%, transparent), 0 1px 2px color-mix(in srgb, var(--lobe-color-bg-layout) 30%, transparent)',
    '--lobe-a2ui-card-sheen': 'color-mix(in srgb, var(--lobe-color-text) 2.2%, transparent)',
    '--lobe-a2ui-radius': '14px',
    '--lobe-a2ui-shadow-md':
      '0 4px 12px color-mix(in srgb, var(--lobe-color-bg-layout) 40%, transparent)',
    '--lobe-a2ui-shadow-sm':
      '0 1px 3px color-mix(in srgb, var(--lobe-color-bg-layout) 50%, transparent)',
    '--lobe-a2ui-shadow-xs':
      '0 1px 2px color-mix(in srgb, var(--lobe-color-bg-layout) 50%, transparent)',
  },
  light: {
    '--lobe-a2ui-floor': 'color-mix(in srgb, var(--lobe-color-text) 2.5%, transparent)',
    '--lobe-a2ui-input-bg': 'var(--lobe-color-bg-container)',
    '--lobe-a2ui-surface': 'var(--lobe-color-bg-container)',
    '--lobe-a2ui-surface-2': 'var(--lobe-color-bg-elevated)',
    '--lobe-a2ui-card-shadow':
      '0 1px 2px color-mix(in srgb, var(--lobe-color-text) 6%, transparent), 0 1px 3px color-mix(in srgb, var(--lobe-color-text) 4%, transparent)',
    '--lobe-a2ui-card-sheen': 'transparent',
    '--lobe-a2ui-radius': '14px',
    '--lobe-a2ui-shadow-md':
      '0 4px 12px color-mix(in srgb, var(--lobe-color-text) 8%, transparent)',
    '--lobe-a2ui-shadow-sm':
      '0 1px 3px color-mix(in srgb, var(--lobe-color-text) 12%, transparent)',
    '--lobe-a2ui-shadow-xs':
      '0 1px 2px color-mix(in srgb, var(--lobe-color-text) 12%, transparent)',
  },
};
