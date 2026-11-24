import { stableClasses } from '@/utils/bem';

export const diffStatClasses = stableClasses({
  block: 'diff-stat',
  dataAttributes: ['kind'],
  elements: ['kind', 'additions', 'deletions'],
});
