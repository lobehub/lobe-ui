import { stableClasses } from '@/utils/bem';

export const paginationClasses = stableClasses({
  block: 'pagination',
  dataAttributes: ['size', 'simple', 'disabled'],
  elements: [
    'total',
    'prev',
    'next',
    'item',
    'jump',
    'simple-pager',
    'size-changer',
    'jumper',
    'jumper-input',
    'go',
  ],
});
