import { stableClasses } from '@/utils/bem';

export const tableClasses = stableClasses({
  block: 'table',
  dataAttributes: ['variant', 'size'],
  elements: [
    'wrapper',
    'title',
    'section',
    'content',
    'header-wrapper',
    'header-row',
    'header-cell',
    'body-wrapper',
    'body-row',
    'body-cell',
    'footer',
  ],
});
