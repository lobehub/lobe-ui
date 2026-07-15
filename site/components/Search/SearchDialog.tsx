import { ArrowUpRight, Search, X } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { loadSearchEngine } from '../../search/loadSearchEngine';
import type { SearchEngine, SearchHit } from '../../search/types';
import type { DocumentManifestEntry } from '../../types/content';
import { styles } from './style';

interface SearchDialogProps {
  documents: readonly DocumentManifestEntry[];
  loadEngine?: (documents: readonly DocumentManifestEntry[]) => SearchEngine;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
}

const focusableSelector =
  'input:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function SearchDialog({
  documents,
  loadEngine = loadSearchEngine,
  onOpenChange,
  open,
  triggerRef,
}: SearchDialogProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SearchEngine | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef(0);
  const resultListId = useId();
  const navigate = useNavigate();

  const close = useCallback(() => {
    requestRef.current += 1;
    setActiveIndex(0);
    setHits([]);
    setLoading(false);
    setQuery('');
    onOpenChange(false);
    triggerRef.current?.focus();
  }, [onOpenChange, triggerRef]);

  const search = useCallback(async (value: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    const request = ++requestRef.current;
    const isCurrent = () => request === requestRef.current && engineRef.current === engine;
    setLoading(Boolean(value.trim()));
    try {
      await engine.preload(value);
      if (!isCurrent()) return;
      const nextHits = await engine.search(value);
      if (!isCurrent()) return;
      setHits(nextHits);
      setActiveIndex(0);
    } catch {
      if (!isCurrent()) return;
      setHits([]);
      setActiveIndex(0);
    } finally {
      if (isCurrent()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const request = ++requestRef.current;
    const engine = loadEngine(documents);
    engineRef.current = engine;
    let active = true;
    void engine.init().catch(() => {
      if (!active || request !== requestRef.current || engineRef.current !== engine) return;
      setHits([]);
      setActiveIndex(0);
      setLoading(false);
    });
    inputRef.current?.focus();
    return () => {
      active = false;
      requestRef.current += 1;
      if (engineRef.current === engine) engineRef.current = undefined;
    };
  }, [documents, loadEngine, open]);

  const activate = (hit: SearchHit) => {
    close();
    void navigate(hit.pathname);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setQuery(value);
    void search(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown' && hits.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % hits.length);
      return;
    }
    if (event.key === 'ArrowUp' && hits.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + hits.length) % hits.length);
      return;
    }
    if (event.key === 'Enter' && hits[activeIndex]) {
      event.preventDefault();
      activate(hits[activeIndex]);
      return;
    }
    if (event.key !== 'Tab') return;

    const controls = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    );
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return (
    <div className={styles.layer} data-pagefind-ignore="all">
      <button
        aria-label="Dismiss search overlay"
        className={styles.backdrop}
        tabIndex={-1}
        type="button"
        onClick={close}
      />
      <div
        aria-label="Search documentation"
        aria-modal="true"
        className={styles.dialog}
        ref={dialogRef}
        role="dialog"
        onKeyDown={handleKeyDown}
      >
        <div className={styles.inputRow}>
          <Search aria-hidden size={18} strokeWidth={1.8} />
          <input
            aria-activedescendant={hits[activeIndex] ? `${resultListId}-${activeIndex}` : undefined}
            aria-controls={resultListId}
            aria-label="Search documentation"
            autoComplete="off"
            placeholder="Search components and guides"
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
          />
          <button aria-label="Close search" type="button" onClick={close}>
            <X aria-hidden size={17} strokeWidth={1.8} />
          </button>
        </div>

        <div aria-live="polite" className={styles.resultsStatus}>
          {loading ? 'Searching…' : query && hits.length === 0 ? 'No results found' : ''}
        </div>
        <div className={styles.results} id={resultListId} role="listbox">
          {hits.map((hit, index) => (
            <button
              aria-selected={activeIndex === index}
              className={styles.result}
              id={`${resultListId}-${index}`}
              key={hit.id}
              role="option"
              type="button"
              onClick={() => activate(hit)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className={styles.resultCopy}>
                <strong>{hit.title}</strong>
                {hit.section ? <small>{hit.section}</small> : null}
                <span>{hit.excerpt}</span>
              </span>
              <ArrowUpRight aria-hidden size={16} strokeWidth={1.8} />
            </button>
          ))}
        </div>

        <footer className={styles.footer}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
          <span>
            <kbd>Esc</kbd> Close
          </span>
        </footer>
      </div>
    </div>
  );
}
