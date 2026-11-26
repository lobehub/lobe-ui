import { stableClasses } from '@/utils/bem';

export const dashboardSurfaceClasses = stableClasses({
  block: 'dashboard-surface',
  dataAttributes: ['bleed', 'linked', 'variant'],
  elements: [
    'header',
    'heading',
    'heading-link',
    'title',
    'desc',
    'extra',
    'arrow',
    'arrow-link',
    'body',
    'loading',
    'chart',
  ],
});
