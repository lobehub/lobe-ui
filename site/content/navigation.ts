import type { DocumentManifestEntry, NavigationSection } from '../types/content';

const compareDocuments = (left: DocumentManifestEntry, right: DocumentManifestEntry): number => {
  const orderDifference =
    (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
  if (orderDifference !== 0) return orderDifference;
  return left.title.localeCompare(right.title, 'en');
};

export function createNavigation(documents: readonly DocumentManifestEntry[]): NavigationSection[] {
  const sections = new Map<string, DocumentManifestEntry[]>();

  for (const document of documents) {
    if (!document.category) continue;
    const section = sections.get(document.category) ?? [];
    section.push(document);
    sections.set(document.category, section);
  }

  return [...sections.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'en'))
    .map(([title, sectionDocuments]) => ({
      documents: sectionDocuments.toSorted(compareDocuments),
      title,
    }));
}
