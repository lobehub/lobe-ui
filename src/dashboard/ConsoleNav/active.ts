import type { ConsoleNavGroup, ConsoleNavItem } from './type';

export function matchesNavPath(pathname: string, item: Pick<ConsoleNavItem, 'end' | 'href'>) {
  if (item.end || item.href === '/') return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Longest matching href wins, so `/resources/new` does not also light up `/`. */
export function resolveActiveHref(pathname: string, items: readonly ConsoleNavItem[]) {
  return items
    .filter((item) => matchesNavPath(pathname, item))
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;
}

export function collectNavItems(groups: readonly ConsoleNavGroup[]): ConsoleNavItem[] {
  return groups.flatMap((group) => [
    ...(group.items ?? []),
    ...collectNavItems(group.groups ?? []),
  ]);
}

/**
 * Keys of the groups on the path to the active page, outermost first. A group
 * overview page (`href`) counts as being inside that group.
 */
export function findActiveBranch(
  pathname: string,
  groups: readonly ConsoleNavGroup[],
  activeHref: string | undefined,
): string[] {
  for (const group of groups) {
    if (group.href && pathname === group.href) return [group.key];
    const nested = findActiveBranch(pathname, group.groups ?? [], activeHref);
    if (nested.length > 0) return [group.key, ...nested];
    if (activeHref && group.items?.some((item) => item.href === activeHref)) return [group.key];
  }
  return [];
}
