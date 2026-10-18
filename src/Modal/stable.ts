import { stableClasses } from '@/utils/bem';

export const modalClasses = stableClasses({
  block: 'modal',
  dataAttributes: ['draggable', 'fullscreen'],
  elements: [
    'trigger',
    'backdrop',
    'viewport',
    'wrapper',
    'header',
    'title',
    'description',
    'header-actions',
    'fullscreen-toggle',
    'close',
    'content',
    'loading',
    'footer',
  ],
});
