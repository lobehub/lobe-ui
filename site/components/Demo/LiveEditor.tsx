import type { ComponentType } from 'react';
import {
  Activity,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Editor, renderElementAsync } from 'react-live';

import {
  type LiveDiagnostic,
  splitLiveSource,
  transformLiveSource,
} from '../../compiler/demo/liveTransform';
import type { DemoAppearance, DemoModule } from '../../types/demo';
import DemoEnvironment from './DemoEnvironment';

interface LiveEditorProps {
  appearance: DemoAppearance;
  demo: DemoModule;
  resetSignal: number;
}

interface RevisionTag {
  demo: DemoModule;
  source: string;
}

interface EditorSession extends RevisionTag {
  value: string;
}

type ScopeState =
  | (RevisionTag & { status: 'loading' })
  | (RevisionTag & { status: 'failed' })
  | (RevisionTag & { status: 'ready'; value: Record<string, unknown> });

interface DiagnosticState extends RevisionTag {
  values: LiveDiagnostic[];
}

interface PreviewCandidate extends RevisionTag {
  Component: ComponentType;
  generation: number;
}

interface EvaluationInput extends RevisionTag {
  resetSignal: number;
  scope: Record<string, unknown>;
  value: string;
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

const isCurrentRevision = (tag: RevisionTag, demo: DemoModule): boolean =>
  tag.demo === demo && tag.source === demo.source;

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
      <Editor code={code} language="tsx" onChange={onChange} />
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
      className="demo-live-editor__candidate"
      data-live-generation={candidate.generation}
      data-live-state={state}
      inert={state !== 'active'}
    >
      <Activity mode={state === 'fallback' ? 'hidden' : 'visible'}>{content}</Activity>
    </div>
  );
}

export default function LiveEditor({ appearance, demo, resetSignal }: LiveEditorProps) {
  const sourceParts = useMemo(() => splitLiveSource(demo.source), [demo.source]);
  const [editorSession, setEditorSession] = useState<EditorSession>({
    demo,
    source: demo.source,
    value: sourceParts.editableSource,
  });
  const [scopeState, setScopeState] = useState<ScopeState>({
    demo,
    source: demo.source,
    status: 'loading',
  });
  const [diagnosticState, setDiagnosticState] = useState<DiagnosticState>({
    demo,
    source: demo.source,
    values: [],
  });
  const [activeCandidate, setActiveCandidate] = useState<PreviewCandidate>();
  const [fallbackCandidate, setFallbackCandidate] = useState<PreviewCandidate>();
  const [pendingCandidate, setPendingCandidate] = useState<PreviewCandidate>();
  const activeCandidateRef = useRef<PreviewCandidate | undefined>(undefined);
  const currentRevisionRef = useRef<RevisionTag>({ demo, source: demo.source });
  const fallbackCandidateRef = useRef<PreviewCandidate | undefined>(undefined);
  const failedGenerationsRef = useRef(new Set<number>());
  const generationRef = useRef(0);
  const initializedRevisionRef = useRef<RevisionTag | undefined>(undefined);
  const lastEvaluationInputRef = useRef<EvaluationInput | undefined>(undefined);
  const pendingCandidateRef = useRef<PreviewCandidate | undefined>(undefined);
  const previousResetSignalRef = useRef(resetSignal);
  const scopeStateRef = useRef(scopeState);
  currentRevisionRef.current = { demo, source: demo.source };
  scopeStateRef.current = scopeState;

  const editableSource = isCurrentRevision(editorSession, demo)
    ? editorSession.value
    : sourceParts.editableSource;
  const currentScopeState = useMemo<ScopeState>(
    () =>
      isCurrentRevision(scopeState, demo)
        ? scopeState
        : { demo, source: demo.source, status: 'loading' },
    [demo, scopeState],
  );
  const diagnostics = isCurrentRevision(diagnosticState, demo) ? diagnosticState.values : [];
  const currentActiveCandidate =
    activeCandidate && isCurrentRevision(activeCandidate, demo) ? activeCandidate : undefined;
  const currentFallbackCandidate =
    fallbackCandidate && isCurrentRevision(fallbackCandidate, demo) ? fallbackCandidate : undefined;
  const currentPendingCandidate =
    pendingCandidate && isCurrentRevision(pendingCandidate, demo) ? pendingCandidate : undefined;
  activeCandidateRef.current = currentActiveCandidate;
  fallbackCandidateRef.current = currentFallbackCandidate;
  pendingCandidateRef.current = currentPendingCandidate;

  useEffect(() => {
    let subscribed = true;
    const source = demo.source;
    const initialized = initializedRevisionRef.current;
    const sameRevision = initialized?.demo === demo && initialized.source === source;
    if (!sameRevision) {
      initializedRevisionRef.current = { demo, source };
      generationRef.current += 1;
      failedGenerationsRef.current.clear();
      setEditorSession({ demo, source, value: sourceParts.editableSource });
      setScopeState({ demo, source, status: 'loading' });
      setDiagnosticState({ demo, source, values: [] });
      setActiveCandidate(undefined);
      setFallbackCandidate(undefined);
      setPendingCandidate(undefined);
    } else if (
      isCurrentRevision(scopeStateRef.current, demo) &&
      scopeStateRef.current.status !== 'loading'
    ) {
      return;
    }

    demo.loadScope().then(
      (value) => {
        const current = currentRevisionRef.current;
        if (!subscribed || current.demo !== demo || current.source !== source) return;
        setScopeState({ demo, source, status: 'ready', value });
      },
      (error: unknown) => {
        const current = currentRevisionRef.current;
        if (!subscribed || current.demo !== demo || current.source !== source) return;
        setScopeState({ demo, source, status: 'failed' });
        setDiagnosticState({
          demo,
          source,
          values: [
            {
              message: `Unable to load the editable dependency scope: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        });
      },
    );

    return () => {
      subscribed = false;
    };
  }, [demo, demo.source, sourceParts.editableSource]);

  useEffect(() => {
    if (previousResetSignalRef.current === resetSignal) return;
    previousResetSignalRef.current = resetSignal;
    generationRef.current += 1;
    setEditorSession({ demo, source: demo.source, value: sourceParts.editableSource });
    setDiagnosticState({ demo, source: demo.source, values: [] });
    setPendingCandidate(undefined);
  }, [demo, resetSignal, sourceParts.editableSource]);

  useEffect(() => {
    if (currentScopeState.status !== 'ready') return;
    const source = demo.source;
    const previousEvaluation = lastEvaluationInputRef.current;
    if (
      previousEvaluation?.demo === demo &&
      previousEvaluation.source === source &&
      previousEvaluation.scope === currentScopeState.value &&
      previousEvaluation.value === editableSource &&
      previousEvaluation.resetSignal === resetSignal
    ) {
      return;
    }
    lastEvaluationInputRef.current = {
      demo,
      resetSignal,
      scope: currentScopeState.value,
      source,
      value: editableSource,
    };
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    const immutablePrefix = sourceParts.immutableSource ? `${sourceParts.immutableSource}\n\n` : '';
    const combinedSource = `${immutablePrefix}${editableSource}`;
    const transformed = transformLiveSource(combinedSource, sourceParts.immutableImports, {
      diagnosticLineOffset: immutablePrefix.split('\n').length - 1,
    });
    if (!transformed.ok) {
      setPendingCandidate(undefined);
      setDiagnosticState({ demo, source, values: transformed.diagnostics });
      return;
    }

    const matchesCurrentRevision = (): boolean => {
      const current = currentRevisionRef.current;
      return current.demo === demo && current.source === source;
    };
    const onError = (error: Error): void => {
      const isActive = activeCandidateRef.current?.generation === generation;
      const isPending = pendingCandidateRef.current?.generation === generation;
      const isNewest = generationRef.current === generation;
      if (!matchesCurrentRevision() || (!isActive && !isPending && !isNewest)) return;
      failedGenerationsRef.current.add(generation);
      if (isActive) {
        setActiveCandidate(fallbackCandidateRef.current);
        setFallbackCandidate(undefined);
      }
      if (isPending || isNewest) {
        setPendingCandidate((candidate) =>
          candidate?.generation === generation ? undefined : candidate,
        );
      }
      setDiagnosticState({ demo, source, values: [{ message: error.message }] });
    };

    try {
      renderElementAsync(
        { code: transformed.code, enableTypeScript: true, scope: currentScopeState.value },
        (Component) => {
          if (
            !matchesCurrentRevision() ||
            generationRef.current !== generation ||
            failedGenerationsRef.current.has(generation)
          ) {
            return;
          }
          setPendingCandidate({ Component, demo, generation, source });
        },
        onError,
      );
    } catch (error: unknown) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [
    currentScopeState,
    demo,
    editableSource,
    resetSignal,
    sourceParts.immutableImports,
    sourceParts.immutableSource,
  ]);

  const promoteCandidate = useCallback(
    (candidate: PreviewCandidate) => {
      const current = currentRevisionRef.current;
      if (
        current.demo !== candidate.demo ||
        current.source !== candidate.source ||
        generationRef.current !== candidate.generation ||
        failedGenerationsRef.current.has(candidate.generation)
      ) {
        return;
      }
      setFallbackCandidate(activeCandidateRef.current);
      setActiveCandidate(candidate);
      setPendingCandidate((pending) =>
        pending?.generation === candidate.generation ? undefined : pending,
      );
      setDiagnosticState({ demo, source: demo.source, values: [] });
    },
    [demo],
  );

  const candidates = [
    currentFallbackCandidate,
    currentActiveCandidate,
    currentPendingCandidate?.generation === currentActiveCandidate?.generation
      ? undefined
      : currentPendingCandidate,
  ].filter(
    (candidate, index, values): candidate is PreviewCandidate =>
      Boolean(candidate) &&
      values.findIndex((value) => value?.generation === candidate?.generation) === index,
  );

  return (
    <section className="demo-live-editor" data-pagefind-ignore="all">
      <div className="demo-live-editor__source">
        {sourceParts.immutableSource ? (
          <pre aria-label="Read-only imports" className="demo-live-editor__imports" tabIndex={0}>
            <code>{sourceParts.immutableSource}</code>
          </pre>
        ) : null}
        <div className="demo-live-editor__input">
          <SourceEditor
            code={editableSource}
            onChange={(value) => setEditorSession({ demo, source: demo.source, value })}
          />
        </div>
      </div>
      {currentScopeState.status === 'loading' ? (
        <div className="demo-live-editor__status" role="status">
          Loading editable dependencies…
        </div>
      ) : null}
      {diagnostics.length > 0 ? (
        <div aria-live="polite" className="demo-live-editor__diagnostics" role="alert">
          {diagnostics.map((diagnostic) => (
            <p key={`${diagnostic.line ?? 0}:${diagnostic.column ?? 0}:${diagnostic.message}`}>
              {formatDiagnostic(diagnostic)}
            </p>
          ))}
        </div>
      ) : null}
      <div
        aria-label="Edited demo preview"
        className="demo-live-editor__preview"
        data-demo-appearance={appearance}
      >
        {candidates.length > 0 ? (
          <div className="demo-live-editor__stage">
            {candidates.map((candidate) => (
              <CandidateSlot
                appearance={appearance}
                candidate={candidate}
                demoId={`${demo.id}-live`}
                key={candidate.generation}
                state={
                  candidate.generation === currentActiveCandidate?.generation
                    ? 'active'
                    : candidate.generation === currentPendingCandidate?.generation
                      ? 'candidate'
                      : 'fallback'
                }
                onCommit={promoteCandidate}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
