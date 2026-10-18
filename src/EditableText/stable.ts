import { stableClasses } from '@/utils/bem';

export const editableTextClasses = stableClasses({
  block: 'editable-text',
  dataAttributes: ['size', 'variant', 'editing'],
  elements: ['input', 'text', 'edit'],
});
