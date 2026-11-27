import { stableClasses } from '@/utils/bem';

export const imageGalleryClasses = stableClasses({
  block: 'image-gallery',
  dataAttributes: ['variant'],
  elements: ['item', 'image', 'caption'],
});
