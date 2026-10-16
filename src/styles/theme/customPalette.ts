import { type StatusColorScales, statusColorScales } from '@/color/status';

export type LobeStatusPalette = Partial<StatusColorScales>;

const NAME = /^[\w-]+$/;

const registry = new Map<string, LobeStatusPalette>();
const listeners = new Set<() => void>();
let revision = 0;

export const registerLobePalette = (name: string, palette: LobeStatusPalette) => {
  if (!NAME.test(name))
    throw new Error(`Invalid palette name "${name}": use letters, digits, _ or -`);
  registry.set(name, palette);
  notifyPaletteChange();
};

/** Bumps the revision so mounted scopes / useTheme pick up a re-registered palette or neutral. */
export const notifyPaletteChange = () => {
  revision++;
  for (const listener of listeners) listener();
};

export const getPaletteRevision = () => revision;

export const subscribePalettes = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const isRegisteredPalette = (name?: string): name is string => !!name && registry.has(name);

export const resolveStatusScales = (name?: string): StatusColorScales =>
  isRegisteredPalette(name) ? { ...statusColorScales, ...registry.get(name) } : statusColorScales;
