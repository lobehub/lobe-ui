import { stableClasses } from '@/utils/bem';

export const badgeClasses = stableClasses({
  block: 'badge',
  dataAttributes: ['status', 'size', 'dot'],
  elements: ['dot', 'text', 'count'],
});
