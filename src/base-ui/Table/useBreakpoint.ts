import { useEffect, useState } from 'react';

import type { TableBreakpoint } from './type';

/** antd's default Grid breakpoints (`screenSM` … `screenXXXL`). */
export const BREAKPOINT_QUERIES: Record<TableBreakpoint, string> = {
  lg: '(min-width: 992px)',
  md: '(min-width: 768px)',
  sm: '(min-width: 576px)',
  xl: '(min-width: 1200px)',
  xs: '(max-width: 575px)',
  xxl: '(min-width: 1600px)',
  xxxl: '(min-width: 1920px)',
};

const POINTS = Object.keys(BREAKPOINT_QUERIES) as TableBreakpoint[];

const canMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const readScreens = (): ReadonlySet<TableBreakpoint> | null =>
  canMatchMedia()
    ? new Set(POINTS.filter((point) => window.matchMedia(BREAKPOINT_QUERIES[point]).matches))
    : null;

/**
 * Active breakpoints, kept in sync with `matchMedia`. Returns `null` when disabled or when media
 * queries are unavailable (SSR), which callers treat as "show everything".
 */
export const useBreakpoint = (enabled: boolean): ReadonlySet<TableBreakpoint> | null => {
  const [screens, setScreens] = useState(() => (enabled ? readScreens() : null));

  useEffect(() => {
    if (!enabled || !canMatchMedia()) {
      setScreens(null);
      return;
    }
    const update = () => {
      const next = readScreens()!;
      setScreens((previous) =>
        previous?.size === next.size && [...next].every((point) => previous.has(point))
          ? previous
          : next,
      );
    };
    const queries = POINTS.map((point) => window.matchMedia(BREAKPOINT_QUERIES[point]));
    queries.forEach((query) => query.addEventListener('change', update));
    update();
    return () => queries.forEach((query) => query.removeEventListener('change', update));
  }, [enabled]);

  return enabled ? screens : null;
};
