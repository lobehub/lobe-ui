import { stableClasses } from '@/utils/bem';

export const hotkeyClasses = stableClasses({
  block: 'hotkey',
  dataAttributes: ['variant', 'compact', 'inverse-theme'],
  elements: ['kbd'],
});
