import { stableClasses } from '@/utils/bem';

export const tagClasses = stableClasses({
  block: 'tag',
  dataAttributes: ['variant', 'size', 'shape', 'color'],
  elements: ['close'],
});
