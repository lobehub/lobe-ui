import { stableClasses } from '@/utils/bem';

export const autoCompleteClasses = stableClasses({
  block: 'auto-complete',
  dataAttributes: ['variant', 'size', 'shadow'],
  elements: ['prefix', 'input', 'clear', 'suffix', 'positioner', 'popup', 'empty', 'list', 'item'],
});
