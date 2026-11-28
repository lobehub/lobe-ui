import { stableClasses } from '@/utils/bem';

export const followUpClasses = stableClasses({
  block: 'follow-up',
  dataAttributes: ['variant'],
  elements: ['title', 'items', 'item'],
});
