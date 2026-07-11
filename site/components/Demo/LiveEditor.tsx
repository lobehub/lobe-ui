import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

interface CandidateSlotProps {
  active: boolean;
  candidate: PreviewCandidate;
  onCommit: (candidate: PreviewCandidate) => void;
}

const isCurrentRevision = (tag: RevisionTag, demo: DemoModule): boolean =>
  tag.demo === demo && tag.source === demo.source;

const formatDiagnostic = ({ column, line, message }: LiveDiagnostic): string => {
  const location = line ? `Line ${line}${column ? `, column ${column}` : ''}: ` : '';
  return `${location}${message}`;
};

function CandidateSlot({ active, candidate, onCommit }: CandidateSlotProps) {
  const Candidate = candidate.Component;

  useEffect(() => {
    onCommit(candidate);
  }, [candidate, onCommit]);

  return (
    <div
      aria-hidden={active ? undefined : true}
      className="demo-live-editor__candidate"
      data-live-state={active ? 'active' : 'candidate'}
      hidden={!active}
      inert={!active}
    >
      <Candidate />
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
  const [pendingCandidate, setPendingCandidate] = useState<PreviewCandidate>();
  const currentRevisionRef = useRef<RevisionTag>({ demo, source: demo.source });
  const failedGenerationsRef = useRef(new Set<number>());
  const generationRef = useRef(0);
  const previousResetSignalRef = useRef(resetSignal);
  currentRevisionRef.current = { demo, source: demo.source };

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
  const currentPendingCandidate =
    pendingCandidate && isCurrentRevision(pendingCandidate, demo) ? pendingCandidate : undefined;

  useEffect(() => {
    let subscribed = true;
    const source = demo.source;
    generationRef.current += 1;
    failedGenerationsRef.current.clear();
    setEditorSession({ demo, source, value: sourceParts.editableSource });
    setScopeState({ demo, source, status: 'loading' });
    setDiagnosticState({ demo, source, values: [] });
    setActiveCandidate(undefined);
    setPendingCandidate(undefined);

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

    const isCurrentGeneration = (): boolean => {
      const current = currentRevisionRef.current;
      return (
        current.demo === demo && current.source === source && generationRef.current === generation
      );
    };
    const onError = (error: Error): void => {
      if (!isCurrentGeneration()) return;
      failedGenerationsRef.current.add(generation);
      setPendingCandidate((candidate) =>
        candidate?.generation === generation ? undefined : candidate,
      );
      setDiagnosticState({ demo, source, values: [{ message: error.message }] });
    };

    try {
      renderElementAsync(
        { code: transformed.code, enableTypeScript: true, scope: currentScopeState.value },
        (Component) => {
          if (!isCurrentGeneration() || failedGenerationsRef.current.has(generation)) return;
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
      setActiveCandidate(candidate);
      setPendingCandidate((pending) =>
        pending?.generation === candidate.generation ? undefined : pending,
      );
      setDiagnosticState({ demo, source: demo.source, values: [] });
    },
    [demo],
  );

  const candidates = [
    currentActiveCandidate,
    currentPendingCandidate?.generation === currentActiveCandidate?.generation
      ? undefined
      : currentPendingCandidate,
  ].filter((candidate): candidate is PreviewCandidate => Boolean(candidate));

  return (
    <section className="demo-live-editor" data-pagefind-ignore="">
      <div className="demo-live-editor__source">
        {sourceParts.immutableSource ? (
          <pre aria-label="Read-only imports" className="demo-live-editor__imports" tabIndex={0}>
            <code>{sourceParts.immutableSource}</code>
          </pre>
        ) : null}
        <div
          aria-label="Demo source editor"
          aria-multiline="true"
          className="demo-live-editor__input"
          role="textbox"
        >
          <Editor
            code={editableSource}
            language="tsx"
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
          <DemoEnvironment appearance={appearance} demoId={`${demo.id}-live`}>
            {candidates.map((candidate) => (
              <CandidateSlot
                active={candidate.generation === currentActiveCandidate?.generation}
                candidate={candidate}
                key={candidate.generation}
                onCommit={promoteCandidate}
              />
            ))}
          </DemoEnvironment>
        ) : null}
      </div>
    </section>
  );
}
