import { stableClasses } from '@/utils/bem';

export const guideCardClasses = stableClasses({
  block: 'guide-card',
  dataAttributes: ['variant', 'shadow'],
  elements: ['close', 'cover', 'content', 'title', 'desc'],
});
