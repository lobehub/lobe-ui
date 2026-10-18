import { stableClasses } from '@/utils/bem';

export const drawerClasses = stableClasses({
  block: 'drawer',
  dataAttributes: ['placement'],
  elements: [
    'trigger',
    'backdrop',
    'popup',
    'header',
    'container',
    'title',
    'description',
    'extra',
    'close',
    'content',
    'body-content',
    'sidebar',
    'sidebar-content',
    'footer',
  ],
});
