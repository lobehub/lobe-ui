import { stableClasses } from '@/utils/bem';

export const selectClasses = stableClasses({
  block: 'select',
  dataAttributes: ['variant', 'size', 'shadow', 'mode'],
  elements: [
    'prefix',
    'value',
    'search',
    'suffix',
    'clear',
    'icon',
    'positioner',
    'popup',
    'list',
    'option',
    'item-text',
    'item-indicator',
    'group',
    'group-label',
    'empty',
    'scroll-up-arrow',
    'scroll-down-arrow',
    'arrow',
  ],
});
