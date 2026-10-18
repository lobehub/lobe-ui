import { stableClasses } from '@/utils/bem';

export const floatingPanelClasses = stableClasses({
  block: 'floating-panel',
  dataAttributes: ['placement'],
  elements: [
    'backdrop',
    'wrapper',
    'resize-handle',
    'header',
    'title',
    'header-actions',
    'actions',
    'close',
    'body',
    'footer',
  ],
});
