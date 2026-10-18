import { stableClasses } from '@/utils/bem';

export const formSharedElements = [
  'flat-group',
  'group',
  'group-header',
  'group-trigger',
  'group-title',
  'group-desc',
  'group-body',
  'field',
  'field-label',
  'field-control',
  'field-error',
  'divider',
  'title',
  'title-content',
  'title-text',
  'title-tag',
  'title-desc',
  'footer',
  'submit-footer',
  'unsaved',
] as const;

export const formClasses = stableClasses({
  block: 'form',
  dataAttributes: ['variant'],
  elements: formSharedElements,
});
