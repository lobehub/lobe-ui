import { stableClasses } from '@/utils/bem';

export const comparisonTableClasses = stableClasses({
  block: 'comparison-table',
  dataAttributes: ['variant'],
  elements: ['header', 'title', 'table', 'option', 'feature', 'cell'],
});
