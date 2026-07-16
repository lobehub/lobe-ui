export const PAGEFIND_HMR_EVENT = 'lobe-docs:pagefind-updated';

export interface SearchHit {
  excerpt: string;
  id: string;
  pathname: string;
  section?: string;
  title: string;
}

export interface SearchEngine {
  dispose?: () => Promise<void>;
  init: () => Promise<void>;
  preload: (query: string) => Promise<void>;
  search: (query: string) => Promise<SearchHit[]>;
}
