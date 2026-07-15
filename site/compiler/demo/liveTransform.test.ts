import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { extractImmutableImports, transformLiveSource } from './liveTransform';

describe('transformLiveSource', () => {
  it('turns a default component export into a rendered DemoEntry', () => {
    const source = `import { useState } from 'react';

export default () => {
  const [label] = useState('Ready');
  return <button>{label}</button>;
};`;

    const result = transformLiveSource(source, extractImmutableImports(source));

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.code).toContain('const DemoEntry = () =>');
    expect(result.code).toContain("useState('Ready')");
    expect(result.code).toContain('render(<DemoEntry />)');
    expect(result.code).not.toContain("from 'react'");
  });

  it.each([
    ['function', 'export default function Example() { return <div>Function</div>; }'],
    ['class', 'export default class Example { render() { return <div>Class</div>; } }'],
  ])('supports a default %s declaration', (_kind, source) => {
    const result = transformLiveSource(source, []);

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.code).toContain('DemoEntry');
    expect(result.code).toContain('render(<DemoEntry />)');
    expect(result.code).not.toContain('export default');
  });

  it.each([
    [
      'function',
      "export default function Original() { return 'function'; }\nconst later = Original;",
    ],
    ['class', "export default class Original { value = 'class'; }\nconst later = Original;"],
  ])('preserves the binding of a named default %s declaration', (_kind, source) => {
    const result = transformLiveSource(source, []);

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.code).toContain('const DemoEntry = Original;');

    const executable = result.code.replace(/render\(<DemoEntry \/>\);\s*$/, '');
    expect(() => new Function(`${executable}\nreturn later === DemoEntry;`)()).not.toThrow();
    expect(new Function(`${executable}\nreturn later === DemoEntry;`)()).toBe(true);
  });

  it('aliases an existing identifier default export without rewriting its declaration', () => {
    const source = `const StreamingPlayground = () => <div>Streaming</div>;
export default StreamingPlayground;`;

    const result = transformLiveSource(source, []);

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.code).toContain('const DemoEntry = StreamingPlayground;');
    expect(result.code).toContain('render(<DemoEntry />)');
  });

  it('removes matching type and relative runtime imports from live code', () => {
    const source = `import type { HelperProps } from './helper';
import { helper } from './helper';
export default function Example(props: HelperProps) { return <div>{helper(props)}</div>; }`;

    const result = transformLiveSource(source, extractImmutableImports(source));

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.code).not.toContain("from './helper'");
    expect(result.code).toContain('helper(props)');
  });

  it('rejects edited imports with an actionable source location', () => {
    const repositorySource = `import { Button } from '@lobehub/ui';
export default () => <Button />;`;
    const editedSource = `import { Input } from '@lobehub/ui';
export default () => <Input />;`;

    expect(
      transformLiveSource(editedSource, extractImmutableImports(repositorySource)),
    ).toMatchObject({
      diagnostics: [
        {
          column: 1,
          line: 1,
          message: expect.stringContaining('Imports are read-only'),
        },
      ],
      ok: false,
    });
  });

  it('returns structured syntax diagnostics instead of throwing', () => {
    const result = transformLiveSource('export default () => <div>;', []);

    expect(result).toMatchObject({
      diagnostics: expect.arrayContaining([
        {
          column: expect.any(Number),
          line: 1,
          message: expect.any(String),
        },
      ]),
      ok: false,
    });
  });

  it('maps diagnostics back to the visible editable source line numbers', () => {
    const immutableSource = "import { Button } from '@lobehub/ui';";
    const editableSource = 'export default () => <div>;';
    const result = transformLiveSource(
      `${immutableSource}\n\n${editableSource}`,
      extractImmutableImports(immutableSource),
      { diagnosticLineOffset: 2 },
    );

    expect(result).toMatchObject({
      diagnostics: expect.arrayContaining([expect.objectContaining({ line: 1 })]),
      ok: false,
    });
  });

  it('compares complete import semantics while permitting trivia-only formatting changes', () => {
    const repositorySource = `import Default, { type Props, value as renamed } from 'package';
import * as Namespace from 'namespace';
import 'side-effect';
import {} from 'empty';
export default () => <Default value={renamed} namespace={Namespace} />;`;
    const triviaOnlyEdit = `import Default,{type Props,value as renamed} from "package";
import * as Namespace from "namespace";
import "side-effect";
import {} from "empty";
export default () => <Default value={renamed} namespace={Namespace} />;`;

    expect(
      transformLiveSource(triviaOnlyEdit, extractImmutableImports(repositorySource)),
    ).toMatchObject({ ok: true });

    const reordered = triviaOnlyEdit.replace(
      'import * as Namespace from "namespace";\nimport "side-effect";',
      'import "side-effect";\nimport * as Namespace from "namespace";',
    );
    expect(transformLiveSource(reordered, extractImmutableImports(repositorySource))).toMatchObject(
      {
        diagnostics: [expect.objectContaining({ line: 2 })],
        ok: false,
      },
    );
  });

  it.each([
    ['deleted', 'export default () => null;'],
    [
      'added',
      "import { Button } from '@lobehub/ui';\nimport { Input } from '@lobehub/ui';\nexport default () => null;",
    ],
  ])('rejects %s imports', (_kind, editedSource) => {
    const repositorySource =
      "import { Button } from '@lobehub/ui';\nexport default () => <Button />;";
    expect(
      transformLiveSource(editedSource, extractImmutableImports(repositorySource)),
    ).toMatchObject({ ok: false });
  });

  it('diagnoses missing and duplicate default exports', () => {
    expect(transformLiveSource('const Demo = () => null;', [])).toMatchObject({
      diagnostics: [expect.objectContaining({ message: expect.stringMatching(/one default/i) })],
      ok: false,
    });
    expect(
      transformLiveSource('export default () => null;\nexport default () => null;', []),
    ).toMatchObject({
      diagnostics: [expect.objectContaining({ message: expect.stringMatching(/more than one/i) })],
      ok: false,
    });
  });

  it('transforms representative simple, StoryBook, and relative-helper repository demos', () => {
    const repositoryRoot = resolve(import.meta.dirname, '../../..');
    const sources = [
      'src/Flex/demos/basic.tsx',
      'src/Button/demos/index.tsx',
      'tests/fixtures/site/demos/local-import.tsx',
    ].map((path) => readFileSync(resolve(repositoryRoot, path), 'utf8'));

    for (const source of sources) {
      expect(transformLiveSource(source, extractImmutableImports(source))).toMatchObject({
        ok: true,
      });
    }
  });
});
