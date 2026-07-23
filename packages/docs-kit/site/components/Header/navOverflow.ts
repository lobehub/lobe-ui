import type { NavigationSection } from '../../types/content';

export const MAX_PRIMARY_SECTIONS = 5;

const preferredSectionTitles = ['Components', 'Base UI', 'Chat', 'Icons', 'Brand'];

interface NavItemLike {
  external?: boolean;
  href: string;
  label: string;
}

export interface NavModel {
  collapsibleKeys: string[];
  defaultCollapsedCount: number;
  externalNavItems: NavItemLike[];
  fixedKeys: string[];
  hasChangelogNavItem: boolean;
  orderedSections: NavigationSection[];
}

export function buildNavModel(
  navigation: readonly NavigationSection[],
  navItems: readonly NavItemLike[],
): NavModel {
  const preferredSections = preferredSectionTitles
    .map((title) => navigation.find((section) => section.title === title))
    .filter((section) => section !== undefined);
  const remainingSections = navigation.filter(
    (section) => !preferredSectionTitles.includes(section.title),
  );
  const orderedSections = [...preferredSections, ...remainingSections];

  const externalNavItems = navItems.filter((item) => item.external);
  const internalNavItems = navItems.filter((item) => !item.external);
  const hasChangelogNavItem = navItems.some((item) => item.href === '/changelog');

  return {
    collapsibleKeys: [
      ...orderedSections.map((section) => `section:${section.title}`),
      ...externalNavItems.map((item) => `nav:${item.label}`),
      ...(hasChangelogNavItem ? [] : ['changelog']),
    ],
    defaultCollapsedCount:
      Math.max(0, orderedSections.length - MAX_PRIMARY_SECTIONS) +
      externalNavItems.length +
      (hasChangelogNavItem ? 0 : 1),
    externalNavItems,
    fixedKeys: ['home', ...internalNavItems.map((item) => `nav:${item.label}`)],
    hasChangelogNavItem,
    orderedSections,
  };
}

export interface NavOverflowMetrics {
  available: number;
  candidateWidths: readonly number[];
  fixedWidths: readonly number[];
  gap: number;
  moreWidth: number;
}

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0);

export function computeCollapsedCount({
  available,
  candidateWidths,
  fixedWidths,
  gap,
  moreWidth,
}: NavOverflowMetrics): number {
  const fixedTotal = sum(fixedWidths);

  for (let collapsed = 0; collapsed <= candidateWidths.length; collapsed++) {
    const visible = candidateWidths.length - collapsed;
    const itemCount = fixedWidths.length + visible + (collapsed > 0 ? 1 : 0);
    const rowWidth =
      fixedTotal +
      sum(candidateWidths.slice(0, visible)) +
      (collapsed > 0 ? moreWidth : 0) +
      gap * Math.max(0, itemCount - 1);
    if (rowWidth <= available) return collapsed;
  }

  return candidateWidths.length;
}
