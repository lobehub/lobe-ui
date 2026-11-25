import { stableClasses } from '@/utils/bem';

export const listClasses = stableClasses({
  block: 'list',
  dataAttributes: ['variant', 'compact', 'selectable', 'glide'],
  elements: ['row', 'item', 'body', 'label', 'description', 'extra', 'actions', 'divider', 'glide'],
});
