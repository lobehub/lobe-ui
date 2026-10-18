import { stableClasses } from '@/utils/bem';

export const alertClasses = stableClasses({
  block: 'alert',
  dataAttributes: ['alert-type', 'alert-variant'],
  elements: [
    'icon',
    'content',
    'title',
    'description',
    'action',
    'close',
    'container',
    'extra',
    'extra-header',
    'extra-indicator',
    'extra-content',
  ],
});
