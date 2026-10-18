import { stableClasses } from '@/utils/bem';

export const buttonClasses = stableClasses({
  block: 'button',
  dataAttributes: ['type', 'size', 'shape', 'danger', 'ghost', 'loading', 'block'],
  elements: ['icon', 'spinner'],
});

export const splitButtonClasses = stableClasses({
  block: 'split-button',
  dataAttributes: ['type', 'size', 'danger', 'loading'],
  elements: ['main', 'menu'],
});
