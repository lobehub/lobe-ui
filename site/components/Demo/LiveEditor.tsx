import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
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

const formatDiagnostic = ({ column, line, message }: LiveDiagnostic): string => {
  const location = line ? `Line ${line}${column ? `, column ${column}` : ''}: ` : '';
  return `${location}${message}`;
};

export default function LiveEditor({ appearance, demo, resetSignal }: LiveEditorProps) {
  const sourceParts = useMemo(() => splitLiveSource(demo.source), [demo.source]);
  const [editableSource, setEditableSource] = useState(sourceParts.editableSource);
  const [scope, setScope] = useState<Record<string, unknown>>();
  const [diagnostics, setDiagnostics] = useState<LiveDiagnostic[]>([]);
  const [lastSuccessful, setLastSuccessful] = useState<ComponentType>();

  useEffect(() => {
    let active = true;
    setScope(undefined);
    demo.loadScope().then(
      (loadedScope) => {
        if (active) setScope(loadedScope);
      },
      (error: unknown) => {
        if (!active) return;
        setDiagnostics([
          {
            message: `Unable to load the editable dependency scope: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ]);
      },
    );
    return () => {
      active = false;
    };
  }, [demo]);

  useEffect(() => {
    setEditableSource(sourceParts.editableSource);
  }, [resetSignal, sourceParts.editableSource]);

  useEffect(() => {
    if (!scope) return;
    const source = [sourceParts.immutableSource, editableSource].filter(Boolean).join('\n\n');
    const transformed = transformLiveSource(source, sourceParts.immutableImports);
    if (!transformed.ok) {
      setDiagnostics(transformed.diagnostics);
      return;
    }

    renderElementAsync(
      { code: transformed.code, enableTypeScript: true, scope },
      (component) => {
        setLastSuccessful(() => component);
        setDiagnostics([]);
      },
      (error) => {
        setDiagnostics([{ message: error.message }]);
      },
    );
  }, [editableSource, scope, sourceParts.immutableImports, sourceParts.immutableSource]);

  const LastSuccessful = lastSuccessful;

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
          <Editor code={editableSource} language="tsx" onChange={setEditableSource} />
        </div>
      </div>
      {scope ? null : (
        <div className="demo-live-editor__status" role="status">
          Loading editable dependencies…
        </div>
      )}
      {diagnostics.length > 0 ? (
        <div aria-live="polite" className="demo-live-editor__diagnostics" role="alert">
          {diagnostics.map((diagnostic, index) => (
            <p key={`${diagnostic.line ?? 0}:${diagnostic.column ?? 0}:${index}`}>
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
        {LastSuccessful ? (
          <DemoEnvironment appearance={appearance} demoId={`${demo.id}-live`}>
            <LastSuccessful />
          </DemoEnvironment>
        ) : null}
      </div>
    </section>
  );
}
