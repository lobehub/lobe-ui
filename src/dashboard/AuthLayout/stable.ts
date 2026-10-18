import { stableClasses } from '@/utils/bem';

export const dashboardAuthLayoutClasses = stableClasses({
  block: 'dashboard-auth-layout',
  dataAttributes: ['variant', 'background', 'split', 'loading'],
  elements: [
    'backdrop',
    'header',
    'tools',
    'main',
    'card',
    'frame',
    'form',
    'intro',
    'logo',
    'title',
    'description',
    'skeleton',
    'footer',
    'aside',
    'aside-plate',
    'aside-panel',
    'aside-scrim',
    'aside-copy',
    'aside-kicker',
    'aside-line',
  ],
});
