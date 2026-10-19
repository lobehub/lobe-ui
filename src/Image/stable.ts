import { stableClasses } from '@/utils/bem';

export const imageClasses = stableClasses({
  block: 'image',
  dataAttributes: ['variant'],
  elements: ['actions', 'wrapper', 'image'],
});
