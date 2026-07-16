import type {
  DocumentManifestEntry,
  NavigationCategory,
  NavigationSection,
} from '../types/content';

export interface FrozenNavigationDocument {
  section: string;
  source: string;
}

export const toFrozenNavigationDocuments = (
  navSections: Record<string, string>,
): FrozenNavigationDocument[] =>
  Object.entries(navSections).map(([source, section]) => ({ section, source }));

export const reviewedCategoryOrder = {
  General: -1,
} as const satisfies Readonly<Record<string, number>>;

export const reviewedSectionOrder = [
  'Components',
  'Base UI',
  'Chat',
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

const sourceIdentity = (source: string): string =>
  source.replaceAll('\\', '/').replace(/\.mdx?$/, '');

const subTypeSectionTitle = (subType: string): string =>
  subType.charAt(0).toUpperCase() + subType.slice(1);

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

const compareSections = (left: NavigationSection, right: NavigationSection): number =>
  (sectionOrder.get(left.title as (typeof reviewedSectionOrder)[number]) ??
    Number.MAX_SAFE_INTEGER) -
  (sectionOrder.get(right.title as (typeof reviewedSectionOrder)[number]) ??
    Number.MAX_SAFE_INTEGER);

export function createNavigation(
  documents: readonly DocumentManifestEntry[],
  frozenDocuments: readonly FrozenNavigationDocument[],
): NavigationSection[] {
  const frozenBySource = new Map<string, FrozenNavigationDocument[]>();
  for (const frozenDocument of frozenDocuments) {
    const key = sourceIdentity(frozenDocument.source);
    const records = frozenBySource.get(key) ?? [];
    records.push(frozenDocument);
    frozenBySource.set(key, records);
  }

  const diagnostics: string[] = [];
  const sections = new Map<string, Map<string, DocumentManifestEntry[]>>();

  for (const document of documents) {
    const frozenRecords = frozenBySource.get(sourceIdentity(document.source)) ?? [];

    if (frozenRecords.length === 0 && document.subType) {
      if (!document.category) {
        diagnostics.push(`${document.source}: component navigation requires a category`);
        continue;
      }

      const section = subTypeSectionTitle(document.subType);
      const categories = sections.get(section) ?? new Map<string, DocumentManifestEntry[]>();
      const categoryDocuments = categories.get(document.category) ?? [];
      categoryDocuments.push(document);
      categories.set(document.category, categoryDocuments);
      sections.set(section, categories);
      continue;
    }

    if (frozenRecords.length === 0) {
      if ([...specialSections.values()].includes(document.pathname)) continue;
      diagnostics.push(`${document.source}: no frozen section record`);
      continue;
    }
    if (frozenRecords.length > 1) {
      diagnostics.push(
        `${document.source}: multiple frozen section records (${frozenRecords
          .map(({ section }) => section || '<empty>')
          .join(', ')})`,
      );
      continue;
    }

    const [{ section }] = frozenRecords;
    const specialPathname = specialSections.get(section);
    if (specialPathname) {
      if (document.pathname !== specialPathname) {
        diagnostics.push(
          `${document.source}: frozen section "${section}" is reserved for ${specialPathname}`,
        );
      }
      continue;
    }
    if (!sectionOrder.has(section as (typeof reviewedSectionOrder)[number])) {
      diagnostics.push(`${document.source}: unknown frozen section "${section || '<empty>'}"`);
      continue;
    }
    if (!document.category) {
      diagnostics.push(`${document.source}: component navigation requires a category`);
      continue;
    }

    const categories = sections.get(section) ?? new Map<string, DocumentManifestEntry[]>();
    const categoryDocuments = categories.get(document.category) ?? [];
    categoryDocuments.push(document);
    categories.set(document.category, categoryDocuments);
    sections.set(section, categories);
  }

  if (diagnostics.length > 0) {
    throw new Error(`Invalid documentation navigation:\n- ${diagnostics.join('\n- ')}`);
  }

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
