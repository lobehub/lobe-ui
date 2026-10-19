import { stableClasses } from '@/utils/bem';

export const dashboardPageLoadingClasses = stableClasses({
  block: 'dashboard-page-loading',
  elements: ['stat-grid'],
});

export const dashboardLoadingAnnouncerClasses = stableClasses({
  block: 'dashboard-loading-announcer',
  elements: [],
});

export const dashboardPageHeaderSkeletonClasses = stableClasses({
  block: 'dashboard-page-header-skeleton',
  elements: ['copy', 'title', 'description', 'action'],
});

export const dashboardTableSkeletonClasses = stableClasses({
  block: 'dashboard-table-skeleton',
  elements: ['head', 'head-cell', 'row', 'leading', 'copy', 'tag', 'cell'],
});

export const dashboardStatCardSkeletonClasses = stableClasses({
  block: 'dashboard-stat-card-skeleton',
  elements: ['label', 'value', 'hint'],
});
