import { stableClasses } from '@/utils/bem';

export const sliderClasses = stableClasses({
  block: 'slider',
  elements: ['control', 'track', 'indicator', 'thumb'],
});

export const sliderWithInputClasses = stableClasses({
  block: 'slider-with-input',
  dataAttributes: ['size'],
  elements: ['slider', 'input'],
});
