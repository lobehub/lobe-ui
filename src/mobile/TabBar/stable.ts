import { stableClasses } from '@/utils/bem';

export const mobileTabBarClasses = stableClasses({
  block: 'mobile-tab-bar',
  dataAttributes: ['active'],
  elements: ['inner', 'tab', 'icon', 'title'],
});
