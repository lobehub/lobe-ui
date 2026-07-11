import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';

import Plausible from '../../components/Analytics/Plausible';
import Header from '../../components/Header/Header';
import { contentManifest } from '../content/registry';
import { useSiteTheme } from '../providers/SiteProviders';

const SearchDialog = lazy(() => import('../../components/Search/SearchDialog'));

export default function DocsRouteLayout() {
  const { preference, setPreference } = useSiteTheme();
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
      <a className="docs-skip-link" href="#docs-content">
        Skip to documentation
      </a>
      <Header
        navigation={contentManifest.navigation}
        preference={preference}
        onPreferenceChange={setPreference}
        onSearchOpen={openSearch}
      />
      <Outlet />
      {searchOpen ? (
        <Suspense
          fallback={
            <span className="docs-search-loading" data-pagefind-ignore="all" role="status">
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
    <main className="docs-error" id="docs-content">
      <h1>Documentation unavailable</h1>
      <p>The requested documentation could not be rendered.</p>
    </main>
  );
}
