import { stableClasses } from '@/utils/bem';

export const dashboardFilterSidebarClasses = stableClasses({
  block: 'dashboard-filter-sidebar',
  dataAttributes: ['flush', 'compact'],
  elements: ['toggle', 'drawer-panel', 'sidebar', 'panel', 'head', 'body', 'content'],
});

export const dashboardFilterRowClasses = stableClasses({
  block: 'dashboard-filter-row',
  elements: ['name', 'count'],
});

export const dashboardFilterOptionClasses = stableClasses({
  block: 'dashboard-filter-option',
  dataAttributes: ['selected'],
  elements: ['name', 'count'],
});
