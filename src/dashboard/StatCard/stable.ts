import { stableClasses } from '@/utils/bem';

export const dashboardStatCardClasses = stableClasses({
  block: 'dashboard-stat-card',
  dataAttributes: ['direction', 'tone', 'variant'],
  elements: [
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
