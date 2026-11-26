/**
 * Helpers shared by the `a2ui` variants. Adapted from CopilotKit a2ui-playground (MIT),
 * `renderers/data.tsx` and `renderers/format.ts`.
 */

export type A2uiTone = 'default' | 'positive' | 'negative' | 'warning' | 'info' | 'accent';

const TONES = new Set<A2uiTone>(['default', 'positive', 'negative', 'warning', 'info', 'accent']);

/** lobe-ui colour names (system, preset and a2ui) to an a2ui tone. */
const COLOR_TONE: Record<string, A2uiTone> = {
  accent: 'accent',
  blue: 'info',
  danger: 'negative',
  discovery: 'accent',
  error: 'negative',
  geekblue: 'info',
  gold: 'warning',
  green: 'positive',
  info: 'info',
  magenta: 'accent',
  negative: 'negative',
  orange: 'warning',
  positive: 'positive',
  processing: 'info',
  purple: 'accent',
  red: 'negative',
  success: 'positive',
  volcano: 'negative',
  warning: 'warning',
  yellow: 'warning',
};

/** Map a lobe-ui `color` / `type` / `status` value to an a2ui tone; unknown values fall back. */
export const toA2uiTone = (value: unknown, fallback: A2uiTone = 'default'): A2uiTone => {
  if (typeof value !== 'string') return fallback;
  if (TONES.has(value as A2uiTone)) return value as A2uiTone;
  return COLOR_TONE[value] ?? fallback;
};

/** Guess a tone from a status word ("Active", "Overdue", "Pending"...). */
export const toneFromText = (text: string): A2uiTone => {
  const s = text.toLowerCase();
  if (/(paid|active|done|complete|success|healthy|online|approved|shipped|live|won|pass)/.test(s))
    return 'positive';
  if (/(fail|overdue|error|declined|cancel|churn|lost|blocked|down|critical)/.test(s))
    return 'negative';
  if (/(pending|trial|review|waiting|draft|at risk|due|paused|late)/.test(s)) return 'warning';
  if (/(enterprise|pro|scale|premium)/.test(s)) return 'accent';
  if (/(new|info|beta|starter)/.test(s)) return 'info';
  return 'default';
};

/** Initials of a name: first letter of the first and last word. */
export const initialsOf = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts.at(-1)![0] : '')).toUpperCase() || '?';
};

/** Stable hue (0-359) per name, so initials avatars are distinguishable. */
export const hueOf = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

/** `en-US` number with up to two fraction digits; non-numbers pass through as strings. */
export const formatA2uiNumber = (value: unknown): string => {
  if (typeof value !== 'number' || !Number.isFinite(value))
    return value == null ? '' : String(value);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
};

/** lobe-ui preset palettes used to tint initials avatars, one per name. */
const TINT_PALETTES = [
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'magenta',
] as const;

/**
 * Inline custom properties that tint an initials avatar with a lobe-ui preset palette picked by
 * name (a soft step for the fill, a deep step for the letters; both follow light / dark).
 */
export const avatarTintVars = (name: string) => {
  const palette = TINT_PALETTES[hueOf(name) % TINT_PALETTES.length];
  return {
    '--lobe-a2ui-tint-bg': `var(--lobe-${palette}-3)`,
    '--lobe-a2ui-tint-fg': `var(--lobe-${palette}-11)`,
  };
};
