import './Demo.css';

import {
  Activity,
  type CSSProperties,
  lazy,
  type RefObject,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import type { DemoAppearance, DemoModule, DemoProps } from '../../types/demo';
import CanonicalPreview from './CanonicalPreview';
import DemoToolbar, { DemoToolbarButton, DemoToolbarLink, DemoToolbarSelect } from './DemoToolbar';

type DemoFrameStyle = CSSProperties & { '--demo-frame-height'?: string };
type DemoViewport = 'mobile' | 'responsive' | 'tablet';

const LazyLiveEditor = lazy(() => import('./LiveEditor'));

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
      className="demo-frame__viewport"
      data-demo-appearance={appearance}
      data-demo-viewport={viewport}
      data-pagefind-ignore="all"
    >
      <div className="demo-frame__preview" style={style}>
        <CanonicalPreview appearance={appearance} demo={demo} />
      </div>
    </div>
  );
}

function IsolatedPreview({ appearance, demo, standaloneHref, style, viewport }: PreviewProps) {
  return (
    <div
      className="demo-frame__viewport"
      data-demo-appearance={appearance}
      data-demo-viewport={viewport}
      data-pagefind-ignore="all"
    >
      <iframe
        className="demo-frame__iframe"
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
    <pre className="demo-frame__source" data-pagefind-ignore="all" tabIndex={0}>
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

export default function Demo({
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
  const [appearance, setAppearance] = useState<DemoAppearance>('light');
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

  return (
    <section
      aria-label={title ? undefined : `Demo: ${of.sourcePath}`}
      aria-labelledby={title ? headingId : undefined}
      className="demo-frame"
      data-demo-editable={resolvedEditable}
      data-demo-isolated={isolated}
      data-demo-layout={layout}
      ref={frameRef}
    >
      {title || description ? (
        <header className="demo-frame__header">
          {title ? <h3 id={headingId}>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </header>
      ) : null}
      <DemoToolbar>
        <DemoToolbarButton
          aria-controls={sourcePanelId}
          aria-expanded={expanded}
          onClick={onToggleSource}
        >
          {sourceActionLabel}
        </DemoToolbarButton>
        {resolvedEditable && expanded ? (
          <DemoToolbarButton
            aria-label="Reset source"
            onClick={() => setEditorResetSignal((value) => value + 1)}
          >
            Reset
          </DemoToolbarButton>
        ) : null}
        <DemoToolbarButton aria-label="Copy source" onClick={onCopy}>
          Copy
        </DemoToolbarButton>
        <DemoToolbarLink
          aria-label="Open standalone preview"
          href={standaloneHref}
          rel="noreferrer"
          target="_blank"
        >
          Standalone
        </DemoToolbarLink>
        <DemoToolbarButton
          aria-label={fullScreen ? 'Exit full screen' : 'Enter full screen'}
          onClick={() => void toggleFullScreen(frameRef, fullScreen)}
        >
          {fullScreen ? 'Exit full screen' : 'Full screen'}
        </DemoToolbarButton>
        <DemoToolbarSelect
          aria-label="Preview viewport"
          value={viewport}
          onChange={(event) => setViewport(event.currentTarget.value as DemoViewport)}
        >
          <option value="responsive">Responsive</option>
          <option value="tablet">Tablet</option>
          <option value="mobile">Mobile</option>
        </DemoToolbarSelect>
        <span aria-label="Demo theme" className="demo-toolbar__group" role="group">
          <DemoToolbarButton
            aria-label="Use light demo theme"
            aria-pressed={appearance === 'light'}
            onClick={() => setAppearance('light')}
          >
            Light
          </DemoToolbarButton>
          <DemoToolbarButton
            aria-label="Use dark demo theme"
            aria-pressed={appearance === 'dark'}
            onClick={() => setAppearance('dark')}
          >
            Dark
          </DemoToolbarButton>
        </span>
        <span aria-live="polite" className="demo-toolbar__status">
          {copyStatus}
        </span>
      </DemoToolbar>
      {isolated ? <IsolatedPreview {...previewProps} /> : <EmbeddedPreview {...previewProps} />}
      {expanded || (resolvedEditable && editorOpened) ? (
        <div
          aria-hidden={expanded ? undefined : true}
          className="demo-frame__source-panel"
          data-pagefind-ignore="all"
          hidden={!expanded}
          id={sourcePanelId}
          inert={!expanded}
        >
          {resolvedEditable ? (
            <Activity mode={expanded ? 'visible' : 'hidden'}>
              <Suspense
                fallback={
                  <div className="demo-live-editor__status" role="status">
                    Loading source editor…
                  </div>
                }
              >
                <LazyLiveEditor appearance={appearance} demo={of} resetSignal={editorResetSignal} />
              </Suspense>
            </Activity>
          ) : (
            <ReadOnlySource source={of.source} />
          )}
        </div>
      ) : null}
    </section>
  );
}
