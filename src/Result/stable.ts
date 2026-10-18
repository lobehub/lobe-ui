import { stableClasses } from '@/utils/bem';

export const resultClasses = stableClasses({
  block: 'result',
  dataAttributes: ['status'],
  elements: ['icon', 'title', 'sub-title', 'extra'],
});
