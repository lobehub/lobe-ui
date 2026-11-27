import { stableClasses } from '@/utils/bem';

export const skeletonClasses = stableClasses({
  block: 'skeleton',
  dataAttributes: ['animated', 'type', 'variant'],
  elements: ['line', 'avatar', 'body', 'bar'],
});

export const skeletonAvatarClasses = stableClasses({
  block: 'skeleton-avatar',
  dataAttributes: ['shape'],
  elements: [],
});

export const skeletonTextClasses = stableClasses({
  block: 'skeleton-text',
  elements: ['row'],
});
