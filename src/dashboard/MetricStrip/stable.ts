import { stableClasses } from '@/utils/bem';

export const dashboardMetricStripClasses = stableClasses({
  block: 'dashboard-metric-strip',
  dataAttributes: ['variant', 'direction', 'tone'],
  elements: [
    'card',
    'frame',
    'grid',
    'cell',
    'head',
    'label',
    'action',
    'mark',
    'value',
    'skeleton',
    'foot',
    'delta',
    'hint',
    'chart',
  ],
});
