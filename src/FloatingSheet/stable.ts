import { stableClasses } from '@/utils/bem';

export const floatingSheetClasses = stableClasses({
  block: 'floating-sheet',
  dataAttributes: ['mode', 'variant', 'dragging'],
  elements: ['header', 'handle', 'header-content', 'title', 'header-actions', 'content'],
});
