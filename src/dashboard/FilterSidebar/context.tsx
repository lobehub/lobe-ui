'use client';

import type { ReactNode } from 'react';
import { createContext, use } from 'react';

const FilterSplitContext = createContext(false);

export function FilterSplitProvider({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return <FilterSplitContext value={active}>{children}</FilterSplitContext>;
}

/** True when this content sits in a filter split that is itself the card. */
export function useInFilterSplit() {
  return use(FilterSplitContext);
}
