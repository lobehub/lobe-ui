import { stableClasses } from '@/utils/bem';

export const dashboardConsoleShellClasses = stableClasses({
  block: 'dashboard-console-shell',
  dataAttributes: ['collapsed', 'compact'],
  elements: [
    'skip-link',
    'sidebar',
    'brand',
    'brand-close',
    'nav',
    'footer',
    'workspace',
    'topbar',
    'toggle',
    'topbar-divider',
    'topbar-main',
    'tools',
    'main',
  ],
});

export const dashboardConsoleBrandClasses = stableClasses({
  block: 'dashboard-console-brand',
  elements: ['lockup', 'name'],
});
