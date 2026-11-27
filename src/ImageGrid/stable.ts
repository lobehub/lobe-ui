import { stableClasses } from '@/utils/bem';

export const imageGridClasses = stableClasses({
  block: 'image-grid',
  dataAttributes: ['layout', 'variant'],
  elements: ['item', 'image', 'caption'],
});
