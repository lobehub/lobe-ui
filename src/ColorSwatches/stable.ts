import { stableClasses } from '@/utils/bem';

export const colorSwatchesClasses = stableClasses({
  block: 'color-swatches',
  dataAttributes: ['shape', 'size'],
  elements: ['item', 'check', 'picker'],
});
