import { Search } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { loadSearchEngine } from '../../search/loadSearchEngine';
import type { SearchEngine, SearchSubResult } from '../../search/types';
import type { DocumentManifestEntry } from '../../types/content';
import { addRecent, readRecents, type RecentEntry, removeRecent } from './recentStore';
import { SearchPreviewPane } from './SearchPreviewPane';
import { buildGroups, flattenGroups, type ResultRow, SearchResultList } from './SearchResultList';
import { styles } from './style';
import { useSearchQuery } from './useSearchQuery';

interface SearchDialogProps {
  documents: readonly DocumentManifestEntry[];
  loadEngine?: (documents: readonly DocumentManifestEntry[]) => SearchEngine;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
}

const focusableSelector =
  'input:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), a[href]:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

const stripHash = (pathname: string): string => pathname.split('#')[0] ?? pathname;

export function SearchDialog({
  documents,
  loadEngine = loadSearchEngine,
  onOpenChange,
  open,
  triggerRef,
}: SearchDialogProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [anchorIndex, setAnchorIndex] = useState(-1);
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState<RecentEntry[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const navigate = useNavigate();

  const { hits, loading, reset, search } = useSearchQuery({ documents, loadEngine, open });

  const groups = useMemo(
    () => buildGroups({ documents, hits, query, recents }),
    [documents, hits, query, recents],
  );
  const rows = useMemo(() => flattenGroups(groups), [groups]);

  const boundedIndex = rows.length > 0 ? Math.min(Math.max(activeIndex, 0), rows.length - 1) : 0;
  const activeHit = rows[boundedIndex]?.hit;
  const anchors = activeHit?.subResults ?? [];

  const optionId = useCallback((flatIndex: number) => `${listId}-opt-${flatIndex}`, [listId]);

  useEffect(() => {
    setActiveIndex(0);
    setAnchorIndex(-1);
  }, [hits, query]);

  useEffect(() => {
    if (!open) return;
    setRecents(readRecents());
    inputRef.current?.focus();
  }, [open]);

  const close = useCallback(() => {
    reset();
    setActiveIndex(0);
    setAnchorIndex(-1);
    setQuery('');
    onOpenChange(false);
    triggerRef.current?.focus();
  }, [onOpenChange, reset, triggerRef]);

  const activate = useCallback(
    (row: ResultRow) => {
      addRecent({ category: row.hit.category, pathname: row.hit.pathname, title: row.hit.title });
      close();
      void navigate(row.hit.pathname);
    },
    [close, navigate],
  );

  const activateAnchor = useCallback(
    (anchor: SearchSubResult) => {
      if (activeHit) {
        addRecent({
          category: activeHit.category,
          pathname: stripHash(anchor.pathname),
          title: activeHit.title,
        });
      }
      close();
      void navigate(anchor.pathname);
    },
    [activeHit, close, navigate],
  );

  const handleRemove = useCallback((pathname: string) => {
    removeRecent(pathname);
    setRecents(readRecents());
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setQuery(value);
    setAnchorIndex(-1);
    search(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
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
      return;
    }

    if (anchorIndex >= 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setAnchorIndex((current) => Math.min(current + 1, anchors.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setAnchorIndex((current) => Math.max(current - 1, 0));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setAnchorIndex(-1);
      } else if (event.key === 'Enter' && anchors[anchorIndex]) {
        event.preventDefault();
        activateAnchor(anchors[anchorIndex]);
      }
      return;
    }

    if (event.key === 'ArrowDown' && rows.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % rows.length);
    } else if (event.key === 'ArrowUp' && rows.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + rows.length) % rows.length);
    } else if (event.key === 'ArrowRight' && anchors.length > 0) {
      event.preventDefault();
      setAnchorIndex(0);
    } else if (event.key === 'Enter' && rows[boundedIndex]) {
      event.preventDefault();
      activate(rows[boundedIndex]);
    }
  };

  if (!open) return null;

  const activeDescendant = activeHit ? optionId(boundedIndex) : undefined;
  const status = loading
    ? 'Searching…'
    : query.trim() && rows.length === 0
      ? 'No results found'
      : '';

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
            aria-activedescendant={activeDescendant}
            aria-controls={listId}
            aria-label="Search documentation"
            autoComplete="off"
            placeholder="Search components and guides"
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
          />
          <kbd className={styles.escHint}>esc</kbd>
        </div>

        <div className={styles.body}>
          <SearchResultList
            activeIndex={boundedIndex}
            groups={groups}
            listId={listId}
            optionId={optionId}
            query={query}
            status={status}
            onActivate={activate}
            onRemove={handleRemove}
            onHover={(flatIndex) => {
              setActiveIndex(flatIndex);
              setAnchorIndex(-1);
            }}
          />
          <SearchPreviewPane
            activeHit={activeHit}
            activeOptionId={activeDescendant}
            anchorIndex={anchorIndex}
            query={query}
            onActivateAnchor={activateAnchor}
            onHoverAnchor={setAnchorIndex}
          />
        </div>

        <footer className={styles.footer}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>→</kbd> jump to section
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </footer>
      </div>
    </div>
  );
}
