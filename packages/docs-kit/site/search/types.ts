export const PAGEFIND_HMR_EVENT = 'lobe-docs:pagefind-updated';

export interface SearchSubResult {
  pathname: string;
  title: string;
}

export interface SearchHit {
  category?: string;
  excerpt: string;
  id: string;
  pathname: string;
  section?: string;
  subResults?: SearchSubResult[];
  title: string;
}

export interface SearchEngine {
  dispose?: () => Promise<void>;
  init: () => Promise<void>;
  preload: (query: string) => Promise<void>;
  search: (query: string) => Promise<SearchHit[]>;
}
