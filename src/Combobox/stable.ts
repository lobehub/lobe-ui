import { stableClasses } from '@/utils/bem';

export const comboboxClasses = stableClasses({
  block: 'combobox',
  dataAttributes: ['variant', 'active', 'checked'],
  elements: ['label', 'trigger', 'value', 'popup', 'search', 'list', 'item', 'check', 'empty'],
});
