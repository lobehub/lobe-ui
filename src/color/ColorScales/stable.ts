import { stableClasses } from '@/utils/bem';

export const colorScalesClasses = stableClasses({
  block: 'color-color-scales',
  dataAttributes: ['scale', 'highlight'],
  elements: ['content', 'header', 'index', 'row', 'row-title', 'cell', 'swatch'],
});
