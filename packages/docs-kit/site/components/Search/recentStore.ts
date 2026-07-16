export interface RecentEntry {
  category?: string;
  pathname: string;
  title: string;
}

const STORAGE_KEY = 'lobedocs:search-recents';
const MAX_RECENTS = 5;

const isRecentEntry = (value: unknown): value is RecentEntry => {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.pathname === 'string' && typeof entry.title === 'string';
};

export const readRecents = (): RecentEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentEntry);
  } catch {
    return [];
  }
};

const writeRecents = (entries: RecentEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
};

export const addRecent = (entry: RecentEntry): void => {
  const current = readRecents();
  const next = [entry, ...current.filter((existing) => existing.pathname !== entry.pathname)].slice(
    0,
    MAX_RECENTS,
  );
  writeRecents(next);
};

export const removeRecent = (pathname: string): void => {
  const current = readRecents();
  writeRecents(current.filter((entry) => entry.pathname !== pathname));
};
