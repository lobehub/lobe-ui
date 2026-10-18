import { stableClasses } from '@/utils/bem';

export const draggableSideNavClasses = stableClasses({
  block: 'draggable-side-nav',
  dataAttributes: ['placement', 'expanded'],
  elements: [
    'container',
    'toggle',
    'handle',
    'handle-icon',
    'content',
    'header',
    'body',
    'footer',
    'resize-handle',
  ],
});
