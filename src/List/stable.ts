import { stableClasses } from '@/utils/bem';

export const listClasses = stableClasses({
  block: 'list',
  dataAttributes: ['variant', 'compact', 'selectable'],
  elements: ['row', 'item', 'body', 'label', 'description', 'extra', 'actions', 'divider'],
});
