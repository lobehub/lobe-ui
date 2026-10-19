import { stableClasses } from '@/utils/bem';

export const dashboardFilterStripClasses = stableClasses({
  block: 'dashboard-filter-strip',
  dataAttributes: ['active', 'tone'],
  elements: ['frame', 'grid', 'cell', 'label', 'count'],
});
