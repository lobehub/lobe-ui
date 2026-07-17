import { ActionIcon, type DropdownItem, DropdownMenu } from '@lobehub/ui';
import {
  Code,
  Copy,
  ExternalLink,
  Maximize,
  Minimize,
  Monitor,
  Moon,
  RotateCcw,
  Smartphone,
  Sun,
  Tablet,
} from 'lucide-react';
import { lazy, type RefObject, Suspense, useEffect, useId, useRef, useState } from 'react';

import { useSiteTheme } from '../../app/providers/SiteProviders';
import type {
  DemoAppearance,
  DemoAppearancePreference,
  DemoModule,
  DemoProps,
} from '../../types/demo';
import { CanonicalPreview } from './CanonicalPreview';
import type { DemoFrameStyle, DemoViewport } from './LiveDemo';
import { styles } from './style';

const viewportOptions = [
  { icon: Monitor, label: 'Responsive', value: 'responsive' },
  { icon: Tablet, label: 'Tablet', value: 'tablet' },
  { icon: Smartphone, label: 'Mobile', value: 'mobile' },
] as const;

const appearanceOptions = [
  { icon: Monitor, label: 'Auto', value: 'auto' },
  { icon: Sun, label: 'Light', value: 'light' },
  { icon: Moon, label: 'Dark', value: 'dark' },
] as const satisfies readonly {
  icon: typeof Monitor;
  label: string;
  value: DemoAppearancePreference;
}[];

const standaloneLinkProps = (href: string) =>
  ({ href, rel: 'noreferrer', role: undefined, target: '_blank' }) as unknown as Record<
    string,
    never
  >;

const LazyLiveDemo = lazy(() =>
  import('./LiveDemo').then((module) => ({ default: module.LiveDemo })),
);

const sourcePreferenceKey = (demoId: string): string => `lobe-docs:demo-source:${demoId}`;

const createStandaloneHref = (demo: DemoModule, appearance: DemoAppearance): string => {
  const search = new URLSearchParams();
  if (demo.routeId) search.set('routeId', demo.routeId);
  search.set('appearance', appearance);
  return `/~demos/${encodeURIComponent(demo.id)}?${search.toString()}`;
};

interface PreviewProps {
  appearance: DemoAppearance;
  demo: DemoModule;
  standaloneHref: string;
  style?: DemoFrameStyle;
  viewport: DemoViewport;
}

function EmbeddedPreview({ appearance, demo, style, viewport }: PreviewProps) {
  return (
    <div
      className={styles.viewport}
      data-demo-appearance={appearance}
      data-demo-viewport={viewport}
      data-pagefind-ignore="all"
    >
      <div className={styles.preview} style={style}>
        <CanonicalPreview appearance={appearance} demo={demo} />
      </div>
    </div>
  );
}

function IsolatedPreview({ appearance, demo, standaloneHref, style, viewport }: PreviewProps) {
  return (
    <div
      className={styles.viewport}
      data-demo-appearance={appearance}
      data-demo-viewport={viewport}
      data-pagefind-ignore="all"
    >
      <iframe
        className={styles.iframe}
        loading="lazy"
        src={standaloneHref}
        style={style}
        title={`Isolated demo: ${demo.sourcePath}`}
      />
    </div>
  );
}

function ReadOnlySource({ source }: Pick<DemoModule, 'source'>) {
  return (
    <pre className={styles.source} data-pagefind-ignore="all" tabIndex={0}>
      <code>{source}</code>
    </pre>
  );
}

const readStoredExpansion = (demoId: string): boolean => {
  try {
    return localStorage.getItem(sourcePreferenceKey(demoId)) === 'expanded';
  } catch {
    return false;
  }
};

const writeStoredExpansion = (demoId: string, expanded: boolean): void => {
  try {
    localStorage.setItem(sourcePreferenceKey(demoId), expanded ? 'expanded' : 'collapsed');
  } catch {
    // Storage can be unavailable in hardened or private browser contexts.
  }
};

const toggleFullScreen = async (
  frameRef: RefObject<HTMLElement | null>,
  fullScreen: boolean,
): Promise<void> => {
  if (fullScreen) {
    if (typeof document.exitFullscreen === 'function') await document.exitFullscreen();
    return;
  }
  if (typeof frameRef.current?.requestFullscreen === 'function') {
    await frameRef.current.requestFullscreen();
  }
};

export function Demo({
  description,
  editable,
  height,
  isolated = false,
  layout = 'default',
  of,
  title,
}: DemoProps) {
  const headingId = of.id;
  const sourcePanelId = useId();
  const frameRef = useRef<HTMLElement>(null);
  const resolvedEditable = editable ?? of.editable;
  const [appearancePreference, setAppearancePreference] =
    useState<DemoAppearancePreference>('auto');
  const { appearance: siteAppearance } = useSiteTheme();
  const appearance: DemoAppearance =
    appearancePreference === 'auto' ? siteAppearance : appearancePreference;
  const [copyStatus, setCopyStatus] = useState('');
  const [editorResetSignal, setEditorResetSignal] = useState(0);
  const [editorOpened, setEditorOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [viewport, setViewport] = useState<DemoViewport>('responsive');
  const style: DemoFrameStyle | undefined =
    height === undefined
      ? undefined
      : { '--demo-frame-height': typeof height === 'number' ? `${height}px` : height };
  const standaloneHref = createStandaloneHref(of, appearance);

  useEffect(() => {
    const storedExpansion = readStoredExpansion(of.id);
    setExpanded(storedExpansion);
    setEditorOpened(storedExpansion);
  }, [of.id]);

  useEffect(() => {
    const onFullScreenChange = () => setFullScreen(document.fullscreenElement === frameRef.current);
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  const onToggleSource = () => {
    setExpanded((current) => {
      const next = !current;
      if (next && resolvedEditable) setEditorOpened(true);
      writeStoredExpansion(of.id, next);
      return next;
    });
  };

  const onCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(of.source);
      setCopyStatus('Source copied');
    } catch {
      setCopyStatus('Unable to copy source');
    }
  };

  const sourceActionLabel = expanded
    ? resolvedEditable
      ? 'Hide source editor'
      : 'Hide source'
    : resolvedEditable
      ? 'Show source editor'
      : 'Show source';

  const previewProps: PreviewProps = {
    appearance,
    demo: of,
    standaloneHref,
    style,
    viewport,
  };

  const fullScreenActionLabel = fullScreen ? 'Exit full screen' : 'Enter full screen';
  const activeViewport =
    viewportOptions.find((option) => option.value === viewport) ?? viewportOptions[0];
  const viewportItems: DropdownItem[] = viewportOptions.map(({ icon, label, value }) => ({
    checked: viewport === value,
    icon,
    key: value,
    label,
    onCheckedChange: (checked: boolean) => {
      if (checked) setViewport(value);
    },
    type: 'checkbox',
  }));
  const activeAppearanceOption =
    appearanceOptions.find((option) => option.value === appearancePreference) ??
    appearanceOptions[0];
  const appearanceItems: DropdownItem[] = appearanceOptions.map(({ icon, label, value }) => ({
    checked: appearancePreference === value,
    icon,
    key: value,
    label,
    onCheckedChange: (checked: boolean) => {
      if (checked) setAppearancePreference(value);
    },
    type: 'checkbox',
  }));

  return (
    <section
      aria-label={title ? undefined : `Demo: ${of.sourcePath}`}
      aria-labelledby={title ? headingId : undefined}
      className={styles.frame}
      data-demo-editable={resolvedEditable}
      data-demo-isolated={isolated}
      data-demo-layout={layout}
      ref={frameRef}
    >
      <header className={styles.caption}>
        {title ? <h3 id={headingId}>{title}</h3> : null}
        {description ? <p>{description}</p> : null}
        <div
          aria-label="Demo controls"
          className={styles.actions}
          data-pagefind-ignore="all"
          role="toolbar"
        >
          <ActionIcon
            active={expanded}
            aria-controls={sourcePanelId}
            aria-expanded={expanded}
            aria-label={sourceActionLabel}
            icon={Code}
            size="small"
            title={sourceActionLabel}
            onClick={onToggleSource}
          />
          {resolvedEditable && expanded ? (
            <ActionIcon
              aria-label="Reset source"
              icon={RotateCcw}
              size="small"
              title="Reset source"
              onClick={() => setEditorResetSignal((value) => value + 1)}
            />
          ) : null}
          <ActionIcon
            aria-label="Copy source"
            icon={Copy}
            size="small"
            title="Copy source"
            onClick={onCopy}
          />
          <DropdownMenu items={appearanceItems} placement="bottomRight">
            <ActionIcon
              aria-label="Preview theme"
              icon={activeAppearanceOption.icon}
              size="small"
              title="Preview theme"
            />
          </DropdownMenu>
          <DropdownMenu items={viewportItems} placement="bottomRight">
            <ActionIcon
              aria-label="Preview viewport"
              icon={activeViewport.icon}
              size="small"
              title="Preview viewport"
            />
          </DropdownMenu>
          <ActionIcon
            aria-label="Open standalone preview"
            as="a"
            icon={ExternalLink}
            size="small"
            title="Open standalone preview"
            {...standaloneLinkProps(standaloneHref)}
          />
          <ActionIcon
            aria-label={fullScreenActionLabel}
            icon={fullScreen ? Minimize : Maximize}
            size="small"
            title={fullScreenActionLabel}
            onClick={() => void toggleFullScreen(frameRef, fullScreen)}
          />
          <span aria-live="polite" className={styles.status}>
            {copyStatus}
          </span>
        </div>
      </header>
      {resolvedEditable && editorOpened ? (
        <Suspense
          fallback={
            <>
              {isolated ? (
                <IsolatedPreview {...previewProps} />
              ) : (
                <EmbeddedPreview {...previewProps} />
              )}
              <div className={styles.liveStatus} role="status">
                Loading source editor…
              </div>
            </>
          }
        >
          <LazyLiveDemo
            appearance={appearance}
            demo={of}
            expanded={expanded}
            resetSignal={editorResetSignal}
            sourcePanelId={sourcePanelId}
            style={style}
            viewport={viewport}
          />
        </Suspense>
      ) : (
        <>
          {isolated ? <IsolatedPreview {...previewProps} /> : <EmbeddedPreview {...previewProps} />}
          {expanded ? (
            <div className={styles.sourcePanel} data-pagefind-ignore="all" id={sourcePanelId}>
              <ReadOnlySource source={of.source} />
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
