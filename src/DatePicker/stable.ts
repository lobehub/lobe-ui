import { stableClasses } from '@/utils/bem';

const pickerElements = [
  'prefix',
  'input',
  'suffix',
  'popup',
  'container',
  'header',
  'body',
  'content',
  'item',
  'footer',
] as const;

export const datePickerClasses = stableClasses({
  block: 'date-picker',
  elements: pickerElements,
});

export const dateRangePickerClasses = stableClasses({
  block: 'date-range-picker',
  elements: pickerElements,
});
