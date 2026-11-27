import { stableClasses } from '@/utils/bem';

export const listClasses = stableClasses({
  block: 'list',
  dataAttributes: ['variant', 'compact', 'selectable', 'glide', 'marker', 'direction', 'connector'],
  elements: [
    'row',
    'item',
    'body',
    'label',
    'description',
    'extra',
    'actions',
    'divider',
    'glide',
    'marker',
    'value',
    'children',
    'button',
  ],
});
