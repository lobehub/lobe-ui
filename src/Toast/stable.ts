import { stableClasses } from '@/utils/bem';

export const toastClasses = stableClasses({
  block: 'toast',
  dataAttributes: ['type', 'position'],
  elements: [
    'viewport',
    'content',
    'body',
    'icon',
    'main',
    'title-row',
    'title',
    'close',
    'description',
    'actions',
    'action',
  ],
});
