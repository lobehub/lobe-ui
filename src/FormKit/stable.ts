import { formSharedElements } from '@/Form/stable';
import { stableClasses } from '@/utils/bem';

export const formKitClasses = stableClasses({
  block: 'form-form',
  dataAttributes: ['variant', 'layout'],
  elements: [
    ...formSharedElements,
    'field-required',
    'field-extra',
    'list',
    'list-head',
    'list-title',
    'list-empty',
    'list-row',
    'list-cell',
    'list-remove',
    'list-add',
    'list-foot',
  ],
});
