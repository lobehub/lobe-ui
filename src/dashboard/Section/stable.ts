import { stableClasses } from '@/utils/bem';

export const dashboardSectionClasses = stableClasses({
  block: 'dashboard-section',
  dataAttributes: ['variant'],
  elements: ['header', 'heading', 'title', 'desc', 'actions', 'more', 'body'],
});
