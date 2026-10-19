import { stableClasses } from '@/utils/bem';

export const dashboardConsoleNavClasses = stableClasses({
  block: 'dashboard-console-nav',
  dataAttributes: ['collapsed'],
  elements: [
    'top-items',
    'group',
    'group-head',
    'group-header',
    'group-icon',
    'label',
    'chevron',
    'indicator',
    'group-panel',
    'group-items',
    'fold',
    'fold-body',
    'item',
    'rail-link',
    'icon',
    'badge',
    'dot',
  ],
});

export const dashboardConsoleNavSkeletonClasses = stableClasses({
  block: 'dashboard-console-nav-skeleton',
  elements: ['item', 'group', 'group-header'],
});

export const dashboardConsoleFooterSkeletonClasses = stableClasses({
  block: 'dashboard-console-footer-skeleton',
  elements: [],
});
