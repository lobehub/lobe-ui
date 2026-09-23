import type { NavigationCategory, NavigationSection } from '../types/content';

export const OVERVIEW_BASE_PATHNAME = '/sections';

export const slugifyNavigationTitle = (title: string): string =>
  title
    .normalize('NFKD')
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()
    .replaceAll(/[^\da-z]+/g, '-')
    .replaceAll(/^-+|-+$/g, '');

/** A lone category named after its section adds no structure, so it is flattened away. */
export const hasSubgroups = (section: NavigationSection): boolean =>
  !(section.categories.length === 1 && section.categories[0].title === section.title);

export const sectionOverviewPathname = (section: NavigationSection): string =>
  `${OVERVIEW_BASE_PATHNAME}/${slugifyNavigationTitle(section.title)}`;

export const categoryOverviewPathname = (
  section: NavigationSection,
  category: NavigationCategory,
): string => `${sectionOverviewPathname(section)}/${slugifyNavigationTitle(category.title)}`;

export function listOverviewPathnames(navigation: readonly NavigationSection[]): string[] {
  return navigation.flatMap((section) => {
    const categories = section.categories.filter((category) => category.documents.length > 0);
    if (categories.length === 0) return [];
    return [
      sectionOverviewPathname(section),
      ...(hasSubgroups(section)
        ? categories.map((category) => categoryOverviewPathname(section, category))
        : []),
    ];
  });
}

export interface OverviewMatch {
  category?: NavigationCategory;
  section: NavigationSection;
}

export function findOverview(
  navigation: readonly NavigationSection[],
  pathname: string,
): OverviewMatch | undefined {
  const normalized = pathname.replace(/\/+$/, '');
  for (const section of navigation) {
    if (sectionOverviewPathname(section) === normalized) return { section };
    if (!hasSubgroups(section)) continue;
    const category = section.categories.find(
      (entry) => categoryOverviewPathname(section, entry) === normalized,
    );
    if (category) return { category, section };
  }
  return undefined;
}
