import type { ComponentProps, CSSProperties } from 'react';
import { Activity, useEffect, useLayoutEffect, useRef } from 'react';
import { Editor } from 'react-live';

import type { LiveDiagnostic } from '../../compiler/demo/liveTransform';
import type { DemoAppearance, DemoModule } from '../../types/demo';
import { CanonicalPreview } from './CanonicalPreview';
import { DemoEnvironment } from './DemoEnvironment';
import { styles } from './style';
import type { PreviewCandidate } from './useLiveDemo';
import { useLiveDemo } from './useLiveDemo';

export type DemoFrameStyle = CSSProperties & { '--demo-frame-height'?: string };
export type DemoViewport = 'mobile' | 'responsive' | 'tablet';

interface LiveDemoProps {
  appearance: DemoAppearance;
  demo: DemoModule;
  expanded: boolean;
  resetSignal: number;
  sourcePanelId: string;
  style?: DemoFrameStyle;
  viewport: DemoViewport;
}

interface CandidateSlotProps {
  appearance: DemoAppearance;
  candidate: PreviewCandidate;
  demoId: string;
  onCommit: (candidate: PreviewCandidate) => void;
  state: 'active' | 'candidate' | 'fallback';
}

interface SourceEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const editorTheme: NonNullable<ComponentProps<typeof Editor>['theme']> = {
  plain: { backgroundColor: 'transparent', color: 'var(--docs-syntax-plain)' },
  styles: [
    {
      style: { color: 'var(--docs-syntax-comment)', fontStyle: 'italic' },
      types: ['comment', 'prolog', 'doctype', 'cdata'],
    },
    {
      style: { color: 'var(--docs-syntax-punctuation)' },
      types: ['punctuation', 'operator', 'plain-text'],
    },
    {
      style: { color: 'var(--docs-syntax-keyword)' },
      types: ['keyword', 'boolean', 'important', 'atrule', 'rule'],
    },
    {
      style: { color: 'var(--docs-syntax-entity)' },
      types: ['tag', 'function', 'class-name', 'selector', 'attr-name', 'builtin'],
    },
    {
      style: { color: 'var(--docs-syntax-string)' },
      types: ['string', 'char', 'url', 'number', 'inserted', 'attr-value', 'constant'],
    },
  ],
};

const formatDiagnostic = ({ column, line, message }: LiveDiagnostic): string => {
  const location = line ? `Line ${line}${column ? `, column ${column}` : ''}: ` : '';
  return `${location}${message}`;
};

function SourceEditor({ code, onChange }: SourceEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const annotateEditor = () => {
      const editor = container.querySelector<HTMLElement>(
        'textarea, [contenteditable], pre.prism-code',
      );
      if (!editor) return;
      if (editor.matches('pre') && !editor.hasAttribute('contenteditable')) {
        editor.setAttribute('contenteditable', 'plaintext-only');
      }
      editor.setAttribute('aria-label', 'Demo source editor');
      editor.setAttribute('aria-multiline', 'true');
      editor.setAttribute('role', 'textbox');
      if (editor.tabIndex < 0) editor.tabIndex = 0;
    };

    annotateEditor();
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(annotateEditor);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <Editor code={code} language="tsx" theme={editorTheme} onChange={onChange} />
    </div>
  );
}

function CandidateSlot({ appearance, candidate, demoId, onCommit, state }: CandidateSlotProps) {
  const Candidate = candidate.Component;

  useEffect(() => {
    if (state === 'candidate') onCommit(candidate);
  }, [candidate, onCommit, state]);

  const content = (
    <DemoEnvironment appearance={appearance} demoId={`${demoId}-${candidate.generation}`}>
      <Candidate />
    </DemoEnvironment>
  );

  return (
    <div
      aria-hidden={state === 'active' ? undefined : true}
      className={styles.liveCandidate}
      data-live-generation={candidate.generation}
      data-live-state={state}
      inert={state !== 'active'}
    >
      <Activity mode={state === 'fallback' ? 'hidden' : 'visible'}>{content}</Activity>
    </div>
  );
}

export function LiveDemo({
  appearance,
  demo,
  expanded,
  resetSignal,
  sourcePanelId,
  style,
  viewport,
}: LiveDemoProps) {
  const live = useLiveDemo(demo, resetSignal);
  const showLive = expanded && Boolean(live.activeCandidate);

  return (
    <>
      <div
        className={styles.viewport}
        data-demo-appearance={appearance}
        data-demo-viewport={viewport}
        data-pagefind-ignore="all"
      >
        <div className={styles.preview} style={style}>
          {showLive ? null : <CanonicalPreview appearance={appearance} demo={demo} />}
          <Activity mode={expanded ? 'visible' : 'hidden'}>
            <div aria-label="Edited demo preview" className={styles.liveStage} hidden={!showLive}>
              {live.candidates.map((candidate) => (
                <CandidateSlot
                  appearance={appearance}
                  candidate={candidate}
                  demoId={`${demo.id}-live`}
                  key={candidate.generation}
                  state={
                    candidate.generation === live.activeCandidate?.generation
                      ? 'active'
                      : candidate.generation === live.pendingCandidate?.generation
                        ? 'candidate'
                        : 'fallback'
                  }
                  onCommit={live.promoteCandidate}
                />
              ))}
            </div>
          </Activity>
        </div>
        {showLive ? <span className={styles.liveBadge}>Live</span> : null}
      </div>
      <div
        aria-hidden={expanded ? undefined : true}
        className={styles.sourcePanel}
        data-code-type="live-demo"
        data-pagefind-ignore="all"
        hidden={!expanded}
        id={sourcePanelId}
        inert={!expanded}
      >
        <Activity mode={expanded ? 'visible' : 'hidden'}>
          <section data-pagefind-ignore="all">
            <div className={styles.liveSource}>
              {live.sourceParts.immutableSource ? (
                <pre
                  aria-label="Read-only imports"
                  className={styles.liveImports}
                  data-demo-live-imports=""
                  tabIndex={0}
                >
                  <code>{live.sourceParts.immutableSource}</code>
                </pre>
              ) : null}
              <div className={styles.liveInput}>
                <SourceEditor code={live.editableSource} onChange={live.setEditableSource} />
              </div>
            </div>
            {live.scopeStatus === 'loading' ? (
              <div className={styles.liveStatus} role="status">
                Loading editable dependencies…
              </div>
            ) : null}
            {live.diagnostics.length > 0 ? (
              <div aria-live="polite" className={styles.liveDiagnostics} role="alert">
                {live.diagnostics.map((diagnostic) => (
                  <p
                    key={`${diagnostic.line ?? 0}:${diagnostic.column ?? 0}:${diagnostic.message}`}
                  >
                    {formatDiagnostic(diagnostic)}
                  </p>
                ))}
              </div>
            ) : null}
          </section>
        </Activity>
      </div>
    </>
  );
}
