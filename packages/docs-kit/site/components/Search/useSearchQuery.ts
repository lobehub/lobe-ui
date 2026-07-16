import { useCallback, useEffect, useRef, useState } from 'react';

import { loadSearchEngine } from '../../search/loadSearchEngine';
import type { SearchEngine, SearchHit } from '../../search/types';
import type { DocumentManifestEntry } from '../../types/content';

const SEARCH_DEBOUNCE_MS = 150;

interface UseSearchQueryOptions {
  documents: readonly DocumentManifestEntry[];
  loadEngine: (documents: readonly DocumentManifestEntry[]) => SearchEngine;
  open: boolean;
}

interface UseSearchQuery {
  hits: SearchHit[];
  loading: boolean;
  reset: () => void;
  search: (value: string) => void;
}

export function useSearchQuery({
  documents,
  loadEngine,
  open,
}: UseSearchQueryOptions): UseSearchQuery {
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const engineRef = useRef<SearchEngine | undefined>(undefined);
  const requestRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const runSearch = useCallback(async (engine: SearchEngine, value: string, request: number) => {
    const isCurrent = () => request === requestRef.current && engineRef.current === engine;
    try {
      const nextHits = await engine.search(value);
      if (!isCurrent()) return;
      setHits(nextHits);
    } catch {
      if (!isCurrent()) return;
      setHits([]);
    } finally {
      if (isCurrent()) setLoading(false);
    }
  }, []);

  const search = useCallback(
    (value: string) => {
      const engine = engineRef.current;
      if (!engine) return;
      const request = ++requestRef.current;
      void engine.preload(value).catch(() => {});
      clearTimer();
      if (!value.trim()) {
        setHits([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      timerRef.current = setTimeout(() => {
        timerRef.current = undefined;
        void runSearch(engine, value, request);
      }, SEARCH_DEBOUNCE_MS);
    },
    [clearTimer, runSearch],
  );

  const reset = useCallback(() => {
    clearTimer();
    requestRef.current += 1;
    setHits([]);
    setLoading(false);
  }, [clearTimer]);

  useEffect(() => {
    if (!open) return;
    const request = ++requestRef.current;
    const engine = loadEngine(documents);
    engineRef.current = engine;
    let active = true;
    void engine.init().catch(() => {
      if (!active || request !== requestRef.current || engineRef.current !== engine) return;
      setHits([]);
      setLoading(false);
    });
    return () => {
      active = false;
      clearTimer();
      requestRef.current += 1;
      if (engineRef.current === engine) engineRef.current = undefined;
    };
  }, [clearTimer, documents, loadEngine, open]);

  return { hits, loading, reset, search };
}

export const loadDefaultSearchEngine = loadSearchEngine;
