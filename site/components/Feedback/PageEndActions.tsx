import ActionIcon from '@lobehub/ui/ActionIcon';
import { GithubIcon } from '@lobehub/ui/icons/lucideExtra';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { ComponentType } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { useSiteTheme } from '../../app/providers/SiteProviders';
import { siteMetadata } from '../../content/siteMetadata';
import { styles } from './pageEndActionsStyle';

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

interface PageEndActionsProps {
  loadGiscus?: () => Promise<GiscusModule>;
  pathname: string;
}

type HelpfulResponse = 'no' | 'yes';
type LoadState = 'error' | 'idle' | 'loading' | 'ready';

interface HelpfulSelection {
  response: HelpfulResponse;
  routeGeneration: number;
}

const defaultLoadGiscus = () =>
  import('@giscus/react') as Promise<unknown> as Promise<GiscusModule>;

const discussionsUrl = `https://github.com/${siteMetadata.giscus.repo}/discussions`;

export default function PageEndActions({
  loadGiscus = defaultLoadGiscus,
  pathname,
}: PageEndActionsProps) {
  const discussionPanelId = useId();
  const routeRef = useRef({ generation: 0, pathname });
  if (routeRef.current.pathname !== pathname) {
    routeRef.current = { generation: routeRef.current.generation + 1, pathname };
  }
  const routeGeneration = routeRef.current.generation;

  const [selection, setSelection] = useState<HelpfulSelection>();
  const response = selection?.routeGeneration === routeGeneration ? selection.response : undefined;

  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [Giscus, setGiscus] = useState<ComponentType<GiscusRuntimeProps>>();
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const loadGenerationRef = useRef(0);
  const loaderRef = useRef(loadGiscus);
  const mountedRef = useRef(false);
  const stateRef = useRef<LoadState>('idle');
  const { appearance } = useSiteTheme();

  const load = useCallback(async () => {
    if (!mountedRef.current) return;
    const sameLoader = loaderRef.current === loadGiscus;
    if (sameLoader && (stateRef.current === 'loading' || stateRef.current === 'ready')) return;
    loaderRef.current = loadGiscus;
    const generation = ++loadGenerationRef.current;
    stateRef.current = 'loading';
    setLoadState('loading');
    try {
      const module = await loadGiscus();
      if (!mountedRef.current || generation !== loadGenerationRef.current) return;
      setGiscus(() => module.default);
      stateRef.current = 'ready';
      setLoadState('ready');
    } catch {
      if (!mountedRef.current || generation !== loadGenerationRef.current) return;
      stateRef.current = 'error';
      setLoadState('error');
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
    if (!discussionOpen) return;
    void load();
  }, [discussionOpen, load]);

  useEffect(() => {
    setDiscussionOpen(false);
  }, [pathname]);

  const onToggleDiscussion = () => {
    setDiscussionOpen((open) => !open);
  };

  return (
    <section aria-label="Page feedback" className={styles.root} data-pagefind-ignore="all">
      <div aria-label="Page feedback" className={styles.toolbar} role="toolbar">
        {response ? (
          <span className={styles.status} role="status">
            Thanks
          </span>
        ) : (
          <span className={styles.hint}>Helpful?</span>
        )}
        <ActionIcon
          active={response === 'yes'}
          aria-label="Yes, this page was helpful"
          icon={ThumbsUp}
          size="small"
          title="Yes, this page was helpful"
          onClick={() => setSelection({ response: 'yes', routeGeneration })}
        />
        <ActionIcon
          active={response === 'no'}
          aria-label="No, this page was not helpful"
          icon={ThumbsDown}
          size="small"
          title="No, this page was not helpful"
          onClick={() => setSelection({ response: 'no', routeGeneration })}
        />
        <span aria-hidden className={styles.divider} />
        <ActionIcon
          active={discussionOpen}
          aria-controls={discussionPanelId}
          aria-expanded={discussionOpen}
          aria-label={discussionOpen ? 'Hide discussion' : 'Show discussion'}
          icon={MessageCircle}
          size="small"
          title={discussionOpen ? 'Hide discussion' : 'Show discussion'}
          onClick={onToggleDiscussion}
        />
        <ActionIcon
          aria-label="Open GitHub Discussions"
          icon={GithubIcon}
          size="small"
          title="Open GitHub Discussions"
          onClick={() => {
            window.open(discussionsUrl, '_blank', 'noopener,noreferrer');
          }}
        />
      </div>

      {discussionOpen ? (
        <div className={styles.panel} id={discussionPanelId}>
          {loadState === 'ready' && Giscus ? (
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
          {loadState === 'loading' ? (
            <p className={styles.statusLine} role="status">
              Loading discussion…
            </p>
          ) : null}
          {loadState === 'error' ? (
            <div className={styles.error} role="alert">
              <span>Discussion could not be loaded.</span>
              <button type="button" onClick={() => void load()}>
                Retry
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
