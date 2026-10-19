import { stableClasses } from '@/utils/bem';

export const progressClasses = stableClasses({
  block: 'progress',
  dataAttributes: ['type', 'variant', 'size', 'status'],
  elements: ['meta', 'label', 'info', 'track', 'bar', 'segment', 'rest'],
});
