import * as stylex from '@stylexjs/stylex';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';

import { Plausible } from '../../components/Analytics/Plausible';
import { DocsShell } from '../../components/DocsShell/DocsShell';
import { styles } from '../../styles/globalStyles';
import { contentManifest } from '../content/registry';

const SearchDialog = lazy(() =>
  import('../../components/Search/SearchDialog').then((module) => ({
    default: module.SearchDialog,
  })),
);

export interface DocsOutletContext {
  openSearch: (trigger?: HTMLElement) => void;
}

export default function DocsRouteLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLElement>(null);

  const openSearch = useCallback(
    (trigger?: HTMLElement) => {
      if (searchOpen) return;
      if (trigger) searchTriggerRef.current = trigger;
      setSearchOpen(true);
    },
    [searchOpen],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && searchOpen) {
        event.preventDefault();
        setSearchOpen(false);
        searchTriggerRef.current?.focus();
        return;
      }
      if (event.key.toLocaleLowerCase() !== 'k' || (!event.metaKey && !event.ctrlKey)) return;
      event.preventDefault();
      const activeElement = document.activeElement;
      openSearch(activeElement instanceof HTMLElement ? activeElement : undefined);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, searchOpen]);

  return (
    <>
      <DocsShell
        documents={contentManifest.documents}
        navigation={contentManifest.navigation}
        onSearchOpen={openSearch}
      >
        <div {...stylex.props(styles.page)}>
          <Outlet context={{ openSearch } satisfies DocsOutletContext} />
        </div>
      </DocsShell>
      {searchOpen ? (
        <Suspense
          fallback={
            <span {...stylex.props(styles.searchLoading)} data-pagefind-ignore="all" role="status">
              Loading search…
            </span>
          }
        >
          <SearchDialog
            open
            documents={contentManifest.documents}
            triggerRef={searchTriggerRef}
            onOpenChange={setSearchOpen}
          />
        </Suspense>
      ) : null}
      <Plausible />
    </>
  );
}

export function ErrorBoundary() {
  return (
    <main {...stylex.props(styles.error)} id="docs-content">
      <h1 {...stylex.props(styles.errorTitle)}>Documentation unavailable</h1>
      <p {...stylex.props(styles.errorText)}>The requested documentation could not be rendered.</p>
    </main>
  );
}
