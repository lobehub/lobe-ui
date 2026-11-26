import type { LobeAppearance } from './scope';

/**
 * Non-colour card tokens of the `a2ui` variants, emitted into `theme.css` as `--lobe-a2ui-*` next
 * to each appearance's other variables. Colours are not here: the variants take every colour from
 * the lobe-ui tokens (see `@/internal/a2ui/tokens.stylex`), and the shadows below are mixed from
 * `--lobe-color-text` so they follow the theme too.
 *
 * Geometry and shadow structure adapted from CopilotKit a2ui-playground (MIT), `.a2-card`: a
 * 14px radius, a soft two-layer shadow in light, an inset top highlight and a 2.2% sheen in dark.
 */
export const a2uiTokens: Record<LobeAppearance, Record<string, string>> = {
  dark: {
    '--lobe-a2ui-card-shadow':
      'inset 0 1px 0 color-mix(in srgb, var(--lobe-color-text) 4%, transparent), 0 1px 2px color-mix(in srgb, var(--lobe-color-bg-layout) 30%, transparent)',
    '--lobe-a2ui-card-sheen': 'color-mix(in srgb, var(--lobe-color-text) 2.2%, transparent)',
    '--lobe-a2ui-radius': '14px',
  },
  light: {
    '--lobe-a2ui-card-shadow':
      '0 1px 2px color-mix(in srgb, var(--lobe-color-text) 6%, transparent), 0 1px 3px color-mix(in srgb, var(--lobe-color-text) 4%, transparent)',
    '--lobe-a2ui-card-sheen': 'transparent',
    '--lobe-a2ui-radius': '14px',
  },
};
