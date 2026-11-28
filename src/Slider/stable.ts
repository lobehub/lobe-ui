import { stableClasses } from '@/utils/bem';

export const sliderClasses = stableClasses({
  block: 'slider',
  dataAttributes: ['variant'],
  elements: ['control', 'track', 'indicator', 'thumb', 'header', 'label', 'value'],
});

export const sliderWithInputClasses = stableClasses({
  block: 'slider-with-input',
  dataAttributes: ['size'],
  elements: ['slider', 'input'],
});
