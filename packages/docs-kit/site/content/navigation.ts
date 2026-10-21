import type { DocsSidebarGroupConfig } from '../../src/config';
import type {
  DocumentManifestEntry,
  NavigationCategory,
  NavigationSection,
} from '../types/content';
import { deriveDocumentSection } from './documentSection';

export const reviewedCategoryOrder = {
  General: -1,
} as const satisfies Readonly<Record<string, number>>;

export const reviewedSectionOrder = [
  'Components',
  'Chat',
  'Dashboard',
  'Mobile',
  'Awesome',
  'Brand',
  'Mdx',
  'Icons',
  'Color',
  'Hooks & Providers',
  'StoryBook',
] as const;

const sectionOrder = new Map(reviewedSectionOrder.map((section, index) => [section, index]));
const specialSections = new Map([
  ['Home', '/'],
  ['Changelog', '/changelog'],
]);

const subTypeSectionTitle = (subType: string): string =>
  subType.charAt(0).toUpperCase() + subType.slice(1);

const normalizeDir = (dir: string): string => dir.replaceAll('\\', '/').replace(/\/+$/, '');

const compareDocuments = (left: DocumentManifestEntry, right: DocumentManifestEntry): number => {
  const orderDifference =
    (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
  if (orderDifference !== 0) return orderDifference;
  return (
    left.title.localeCompare(right.title, 'en') || left.pathname.localeCompare(right.pathname, 'en')
  );
};

const compareCategories = (left: NavigationCategory, right: NavigationCategory): number => {
  const leftOrder = reviewedCategoryOrder[left.title as keyof typeof reviewedCategoryOrder];
  const rightOrder = reviewedCategoryOrder[right.title as keyof typeof reviewedCategoryOrder];
  const orderDifference =
    (leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER);
  return orderDifference || left.title.localeCompare(right.title, 'en');
};

export function validateSidebarGroups(
  sidebarGroups: readonly DocsSidebarGroupConfig[],
): DocsSidebarGroupConfig[] {
  const diagnostics: string[] = [];
  const dirs = new Set<string>();
  const titles = new Set<string>();
  const normalized: DocsSidebarGroupConfig[] = [];

  for (const [index, group] of sidebarGroups.entries()) {
    const label = `themeConfig.sidebarGroups[${index}]`;
    const before = diagnostics.length;
    if (!group || typeof group !== 'object') {
      diagnostics.push(`${label}: must be an object`);
      continue;
    }
    if (typeof group.dir !== 'string' || !group.dir.trim()) {
      diagnostics.push(`${label}.dir must be a non-empty string`);
    }
    if (typeof group.title !== 'string' || !group.title.trim()) {
      diagnostics.push(`${label}.title must be a non-empty string`);
    }
    if (group.icon !== undefined && (typeof group.icon !== 'string' || !group.icon.trim())) {
      diagnostics.push(`${label}.icon must be a non-empty string when set`);
    }
    if (
      group.order !== undefined &&
      (typeof group.order !== 'number' || !Number.isFinite(group.order))
    ) {
      diagnostics.push(`${label}.order must be a finite number when set`);
    }
    if (typeof group.dir === 'string' && group.dir.trim()) {
      const dir = normalizeDir(group.dir.trim());
      if (dirs.has(dir)) diagnostics.push(`${label}.dir duplicates another group (${dir})`);
      dirs.add(dir);
    }
    if (typeof group.title === 'string' && group.title.trim()) {
      const title = group.title.trim();
      if (titles.has(title)) diagnostics.push(`${label}.title duplicates another group (${title})`);
      titles.add(title);
    }
    if (diagnostics.length > before) continue;
    normalized.push({
      dir: normalizeDir(group.dir.trim()),
      title: group.title.trim(),
      ...(group.icon ? { icon: group.icon.trim() } : {}),
      ...(group.order === undefined ? {} : { order: group.order }),
    });
  }

  if (diagnostics.length > 0) {
    throw new Error(`Invalid documentation sidebarGroups:\n- ${diagnostics.join('\n- ')}`);
  }
  return normalized;
}

const matchSidebarGroup = (
  source: string,
  groups: readonly DocsSidebarGroupConfig[],
): DocsSidebarGroupConfig | undefined => {
  const normalized = source.replaceAll('\\', '/');
  let best: DocsSidebarGroupConfig | undefined;
  let bestLength = -1;
  for (const group of groups) {
    const dir = normalizeDir(group.dir);
    if ((normalized === dir || normalized.startsWith(`${dir}/`)) && dir.length > bestLength) {
      best = group;
      bestLength = dir.length;
    }
  }
  return best;
};

export function createNavigation(
  documents: readonly DocumentManifestEntry[],
  sectionOverrides: Record<string, string> = {},
  sidebarGroups: readonly DocsSidebarGroupConfig[] = [],
): NavigationSection[] {
  const groups = validateSidebarGroups(sidebarGroups);
  const groupOrder = new Map(
    groups
      .filter((group) => group.order !== undefined)
      .map((group) => [group.title, group.order as number]),
  );
  const diagnostics: string[] = [];
  const sections = new Map<string, Map<string, DocumentManifestEntry[]>>();

  for (const document of documents) {
    const matchedGroup = matchSidebarGroup(document.source, groups);
    const section =
      matchedGroup?.title ??
      (document.subType
        ? subTypeSectionTitle(document.subType)
        : deriveDocumentSection(document.source, sectionOverrides));

    // Home, changelog, and unlisted docs/ guides stay out of the component sidebar.
    if (specialSections.has(section) || (document.source.startsWith('docs/') && !matchedGroup)) {
      continue;
    }

    const category = document.category ?? matchedGroup?.title;
    if (!category) {
      diagnostics.push(`${document.source}: component navigation requires a category`);
      continue;
    }

    const categories = sections.get(section) ?? new Map<string, DocumentManifestEntry[]>();
    const categoryDocuments = categories.get(category) ?? [];
    categoryDocuments.push(document);
    categories.set(category, categoryDocuments);
    sections.set(section, categories);
  }

  if (diagnostics.length > 0) {
    throw new Error(`Invalid documentation navigation:\n- ${diagnostics.join('\n- ')}`);
  }

  const compareSections = (left: NavigationSection, right: NavigationSection): number => {
    const leftOrder =
      groupOrder.get(left.title) ??
      sectionOrder.get(left.title as (typeof reviewedSectionOrder)[number]) ??
      Number.MAX_SAFE_INTEGER;
    const rightOrder =
      groupOrder.get(right.title) ??
      sectionOrder.get(right.title as (typeof reviewedSectionOrder)[number]) ??
      Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder || left.title.localeCompare(right.title, 'en');
  };

  return [...sections.entries()]
    .map(([title, categories]): NavigationSection => ({
      categories: [...categories.entries()]
        .map(([categoryTitle, categoryDocuments]): NavigationCategory => ({
          documents: categoryDocuments.toSorted(compareDocuments),
          title: categoryTitle,
        }))
        .toSorted(compareCategories),
      title,
    }))
    .toSorted(compareSections);
}
