import { stableClasses } from '@/utils/bem';

export const codeEditorClasses = stableClasses({
  block: 'code-editor',
  dataAttributes: ['variant'],
  elements: ['highlight', 'textarea'],
});
