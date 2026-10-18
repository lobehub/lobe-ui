import { stableClasses } from '@/utils/bem';

export const draggablePanelClasses = stableClasses({
  block: 'draggable-panel',
  dataAttributes: ['placement'],
  elements: ['container', 'header', 'body', 'footer', 'content', 'handle', 'toggle'],
});
