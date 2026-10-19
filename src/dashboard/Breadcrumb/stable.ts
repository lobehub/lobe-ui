import { stableClasses } from '@/utils/bem';

export const dashboardBreadcrumbClasses = stableClasses({
  block: 'dashboard-breadcrumb',
  dataAttributes: ['optional'],
  elements: ['crumb', 'link', 'ancestor', 'page', 'separator'],
});
