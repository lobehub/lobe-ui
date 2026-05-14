export const Z_INDEX_LAYER = {
  floating: 1100,
  modal: 1200,
  toast: 100_000,
  step: 10,
} as const;

export type LayerTier = 'floating' | 'modal' | 'toast';
