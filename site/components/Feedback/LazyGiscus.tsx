import './LazyGiscus.css';

import type { ComponentType } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useSiteTheme } from '../../app/providers/SiteProviders';
import { siteMetadata } from '../../content/siteMetadata';

export interface GiscusRuntimeProps {
  category: string;
  categoryId: string;
  emitMetadata: '0';
  inputPosition: 'top';
  lang: 'en';
  loading: 'lazy';
  mapping: 'title';
  reactionsEnabled: '1';
  repo: `${string}/${string}`;
  repoId: string;
  strict: '0';
  theme: 'dark' | 'light';
}

export interface GiscusModule {
  default: ComponentType<GiscusRuntimeProps>;
}

interface LazyGiscusProps {
  loadGiscus?: () => Promise<GiscusModule>;
  pathname: string;
}

type LoadState = 'error' | 'idle' | 'loading' | 'ready';

const defaultLoadGiscus = () =>
  import('@giscus/react') as Promise<unknown> as Promise<GiscusModule>;

export default function LazyGiscus({ loadGiscus = defaultLoadGiscus, pathname }: LazyGiscusProps) {
  const [Giscus, setGiscus] = useState<ComponentType<GiscusRuntimeProps>>();
  const [manual, setManual] = useState(false);
  const [state, setState] = useState<LoadState>('idle');
  const loadGenerationRef = useRef(0);
  const loaderRef = useRef(loadGiscus);
  const mountedRef = useRef(false);
  const stateRef = useRef<LoadState>('idle');
  const sentinelRef = useRef<HTMLElement>(null);
  const { appearance } = useSiteTheme();

  const load = useCallback(async () => {
    if (!mountedRef.current) return;
    const sameLoader = loaderRef.current === loadGiscus;
    if (sameLoader && (stateRef.current === 'loading' || stateRef.current === 'ready')) return;
    loaderRef.current = loadGiscus;
    const generation = ++loadGenerationRef.current;
    stateRef.current = 'loading';
    setState('loading');
    try {
      const module = await loadGiscus();
      if (!mountedRef.current || generation !== loadGenerationRef.current) return;
      setGiscus(() => module.default);
      stateRef.current = 'ready';
      setState('ready');
    } catch {
      if (!mountedRef.current || generation !== loadGenerationRef.current) return;
      stateRef.current = 'error';
      setState('error');
    }
  }, [loadGiscus]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      loadGenerationRef.current += 1;
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      // The deferred client update preserves identical SSR and hydration markup.
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setManual(true);
      return () => {
        loadGenerationRef.current += 1;
      };
    }

    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!active || !entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        void load();
      },
      { rootMargin: '400px 0px' },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => {
      active = false;
      loadGenerationRef.current += 1;
      observer.disconnect();
    };
  }, [load]);

  return (
    <section
      aria-label="Discussion"
      className="docs-feedback"
      data-pagefind-ignore="all"
      ref={sentinelRef}
    >
      <div className="docs-feedback__heading">
        <div>
          <p className="docs-feedback__eyebrow">Community</p>
          <h2>Discussion</h2>
        </div>
        <span>GitHub Discussions</span>
      </div>

      {state === 'ready' && Giscus ? (
        <Giscus
          category={siteMetadata.giscus.category}
          categoryId={siteMetadata.giscus.categoryId}
          emitMetadata="0"
          inputPosition="top"
          key={pathname}
          lang="en"
          loading="lazy"
          mapping="title"
          reactionsEnabled="1"
          repo={siteMetadata.giscus.repo}
          repoId={siteMetadata.giscus.repoId}
          strict="0"
          theme={appearance}
        />
      ) : null}

      {manual && state === 'idle' ? (
        <button className="docs-feedback__action" type="button" onClick={() => void load()}>
          Load discussion
        </button>
      ) : null}
      {state === 'loading' ? <p role="status">Loading discussion…</p> : null}
      {state === 'error' ? (
        <div className="docs-feedback__error" role="alert">
          <span>Discussion could not be loaded.</span>
          <button type="button" onClick={() => void load()}>
            Retry discussion
          </button>
        </div>
      ) : null}
    </section>
  );
}
