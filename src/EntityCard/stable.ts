import { stableClasses } from '@/utils/bem';

export const entityCardClasses = stableClasses({
  block: 'entity-card',
  dataAttributes: ['variant', 'layout', 'clickable', 'tone'],
  elements: [
    'image',
    'body',
    'head',
    'subtitle',
    'badge',
    'title',
    'rating',
    'stars',
    'description',
    'meta',
    'actions',
    'action',
  ],
});
