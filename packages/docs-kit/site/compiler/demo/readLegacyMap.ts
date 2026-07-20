import type { DocumentationInventory } from '../types';

export type StandaloneDemoIdKind = 'canonical' | 'legacy';

export interface StandaloneDemoMapEntry {
  canonicalId: string;
  id: string;
  kind: StandaloneDemoIdKind;
  pathname?: string;
  routeId?: string;
  sourcePath: string;
}

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

export const createCanonicalDemoId = (sourcePath: string): string =>
  normalizePath(sourcePath)
    .replace(/\.[^.]+$/, '')
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/[^A-Za-z\d]+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase();

const compareEntries = (left: StandaloneDemoMapEntry, right: StandaloneDemoMapEntry): number =>
  left.id.localeCompare(right.id, 'en');

export interface CanonicalDemoReference {
  pathname?: string;
  source: string;
}

export function readLegacyMap(
  inventory: DocumentationInventory,
  canonicalReferences: readonly CanonicalDemoReference[] = [],
): StandaloneDemoMapEntry[] {
  const entries: StandaloneDemoMapEntry[] = [];
  const entriesById = new Map<string, StandaloneDemoMapEntry>();
  const canonicalSources = new Map<string, string>();
  const canonicalPathnames = new Map<string, string>();

  const register = (entry: StandaloneDemoMapEntry) => {
    const previous = entriesById.get(entry.id);
    if (previous) {
      throw new Error(
        `Duplicate standalone demo id "${entry.id}" for ${previous.sourcePath} and ${entry.sourcePath}`,
      );
    }
    entriesById.set(entry.id, entry);
    entries.push(entry);
  };

  const trackCanonicalSource = (sourcePath: string): string => {
    const canonicalId = createCanonicalDemoId(sourcePath);
    const previousCanonicalSource = canonicalSources.get(canonicalId);
    if (previousCanonicalSource && previousCanonicalSource !== sourcePath) {
      throw new Error(
        `Canonical standalone demo id collision "${canonicalId}" for ${previousCanonicalSource} and ${sourcePath}`,
      );
    }
    canonicalSources.set(canonicalId, sourcePath);
    return canonicalId;
  };

  for (const reference of canonicalReferences) {
    const sourcePath = normalizePath(reference.source);
    const canonicalId = trackCanonicalSource(sourcePath);
    if (reference.pathname && !canonicalPathnames.has(canonicalId)) {
      canonicalPathnames.set(canonicalId, reference.pathname);
    }
  }

  for (const reference of inventory.demoReferences) {
    const sourcePath = normalizePath(reference.source);
    const canonicalId = trackCanonicalSource(sourcePath);

    register({
      canonicalId,
      id: reference.legacyId,
      kind: 'legacy',
      pathname: reference.pathname,
      routeId: reference.legacyRouteId,
      sourcePath,
    });
  }

  for (const [canonicalId, sourcePath] of canonicalSources) {
    const pathname = canonicalPathnames.get(canonicalId);
    register({
      canonicalId,
      id: canonicalId,
      kind: 'canonical',
      ...(pathname ? { pathname } : {}),
      sourcePath,
    });
  }

  return entries.toSorted(compareEntries);
}

export const createStandaloneDemoPath = (id: string): string => `/~demos/${encodeURIComponent(id)}`;

export const createStandaloneDemoPrerenderPath = (id: string): string => `/~demos/${id}`;

export const getStandaloneDemoPaths = (
  inventory: DocumentationInventory,
  canonicalReferences: readonly CanonicalDemoReference[] = [],
): string[] =>
  readLegacyMap(inventory, canonicalReferences).map(({ id }) =>
    createStandaloneDemoPrerenderPath(id),
  );
