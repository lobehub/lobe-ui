import type { ComponentType } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { renderElementAsync } from 'react-live';

import {
  type LiveDiagnostic,
  splitLiveSource,
  transformLiveSource,
} from '../../compiler/demo/liveTransform';
import type { DemoModule } from '../../types/demo';

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

export interface PreviewCandidate extends RevisionTag {
  Component: ComponentType;
  generation: number;
}

interface EvaluationInput extends RevisionTag {
  resetSignal: number;
  scope: Record<string, unknown>;
  value: string;
}

export interface LiveDemoState {
  activeCandidate?: PreviewCandidate;
  candidates: PreviewCandidate[];
  diagnostics: LiveDiagnostic[];
  editableSource: string;
  pendingCandidate?: PreviewCandidate;
  promoteCandidate: (candidate: PreviewCandidate) => void;
  scopeStatus: ScopeState['status'];
  setEditableSource: (value: string) => void;
  sourceParts: ReturnType<typeof splitLiveSource>;
}

const isCurrentRevision = (tag: RevisionTag, demo: DemoModule): boolean =>
  tag.demo === demo && tag.source === demo.source;

export default function useLiveDemo(demo: DemoModule, resetSignal: number): LiveDemoState {
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

  const setEditableSource = useCallback(
    (value: string) => setEditorSession({ demo, source: demo.source, value }),
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

  return {
    activeCandidate: currentActiveCandidate,
    candidates,
    diagnostics,
    editableSource,
    pendingCandidate: currentPendingCandidate,
    promoteCandidate,
    scopeStatus: currentScopeState.status,
    setEditableSource,
    sourceParts,
  };
}
