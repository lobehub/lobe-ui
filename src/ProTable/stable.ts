import { stableClasses } from '@/utils/bem';

export const proTableClasses = stableClasses({
  block: 'pro-table',
  dataAttributes: ['fullscreen'],
  elements: ['search', 'card', 'toolbar', 'toolbar-title', 'alert', 'alert-info', 'alert-option'],
});
