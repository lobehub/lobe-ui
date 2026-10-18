import { stableClasses } from '@/utils/bem';

export const dropdownMenuClasses = stableClasses({
  block: 'dropdown-menu',
  dataAttributes: ['placement'],
  elements: [
    'trigger',
    'positioner',
    'header',
    'viewport',
    'footer',
    'item',
    'item-content',
    'icon',
    'label-group',
    'label',
    'desc',
    'extra',
    'submenu-arrow',
    'checkbox-indicator',
    'switch',
    'separator',
    'group',
    'group-label',
  ],
});
