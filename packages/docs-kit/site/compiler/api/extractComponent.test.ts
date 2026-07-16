// @vitest-environment node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { extractComponentApi } from './extractComponent';

const fixtureRoot = resolve(import.meta.dirname, '../../../../../tests/fixtures/site/api');
const tsconfigPath = resolve(fixtureRoot, 'tsconfig.json');
const request = (document: string, name: string, from?: string) => ({
  documentPath: resolve(fixtureRoot, document),
  from,
  name,
  tsconfigPath,
});

const temporaryRoots: string[] = [];

const temporaryRequest = (
  files: Record<string, string>,
  name: string,
): ReturnType<typeof request> => {
  const root = mkdtempSync(join(tmpdir(), 'lobe-ui-api-'));
  temporaryRoots.push(root);
  for (const [path, source] of Object.entries(files)) {
    const file = resolve(root, path);
    mkdirSync(resolve(file, '..'), { recursive: true });
    writeFileSync(file, source);
  }
  writeFileSync(
    resolve(root, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        noEmit: true,
        strict: true,
        target: 'ES2022',
      },
      include: ['./**/*.ts'],
    }),
  );
  return {
    documentPath: resolve(root, 'index.mdx'),
    from: undefined,
    name,
    tsconfigPath: resolve(root, 'tsconfig.json'),
  };
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('public component resolution', () => {
  it('uses the nearest named public export and deduplicates an identical default export', () => {
    const component = extractComponentApi(request('Button/index.mdx', 'Button'));

    expect(component).toMatchObject({
      description: 'Callable public fixture component.',
      name: 'Button',
      properties: expect.arrayContaining([
        expect.objectContaining({
          defaultValue: 'false',
          description: 'Shows a loading indicator.',
          name: 'loading',
          required: false,
          since: '1.2.0',
          type: 'boolean',
        }),
      ]),
    });
  });

  it('resolves aliased re-exports by declaration identity', () => {
    const component = extractComponentApi(request('Button/index.mdx', 'Button', '../barrel'));

    expect(component.source.file).toMatch(/component\.tsx$/);
    expect(component.properties.some(({ name }) => name === 'requiredLabel')).toBe(true);
  });

  it('resolves an explicit from with TypeScript module resolution only', () => {
    const component = extractComponentApi(
      request('Button/index.mdx', 'FunctionButton', '../component'),
    );

    expect(component.name).toBe('FunctionButton');
    expect(component.properties).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'loading', required: false })]),
    );
  });

  it('permits a callable default fallback whose declaration name matches the request', () => {
    const component = extractComponentApi(request('DefaultOnly/index.mdx', 'Button'));

    expect(component.name).toBe('Button');
    expect(component.source.file).toMatch(/component\.tsx$/);
  });

  it('rejects a default fallback with a different declaration identity', () => {
    expect(() =>
      extractComponentApi(request('WrongDefault/index.mdx', 'Button', '../ambiguous')),
    ).toThrow(/WrongDefault\/index\.mdx[\s\S]*Button[\s\S]*default[\s\S]*does not match/);
  });

  it('requires from when named and default candidates resolve to different targets', () => {
    expect(() => extractComponentApi(request('Ambiguous/index.mdx', 'Button'))).toThrow(
      /Ambiguous\/index\.mdx[\s\S]*Button[\s\S]*ambiguous[\s\S]*component\.tsx[\s\S]*ambiguous\.ts[\s\S]*from=/,
    );
  });
});

describe('callable props extraction', () => {
  it.each(['FunctionButton', 'MemoButton', 'ForwardButton', 'CompoundButton'])(
    'extracts callable props from %s',
    (name) => {
      const component = extractComponentApi(request('Button/index.mdx', name, '../component'));

      expect(component.properties).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'loading', required: false, type: 'boolean' }),
        ]),
      );
    },
  );

  it('extracts inherited and intersection properties with their declaring source', () => {
    const component = extractComponentApi(
      request('Button/index.mdx', 'IntersectionButton', '../component'),
    );
    const inherited = component.properties.find(({ name }) => name === 'inherited');

    expect(component.properties).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'extra', required: false })]),
    );
    expect(inherited).toMatchObject({
      description: 'A property inherited from the shared fixture contract.',
      inheritedFrom: 'InheritedProps',
      source: expect.objectContaining({ file: expect.stringMatching(/inherited\.ts$/) }),
    });
  });

  it('uses container identity when inherited and local interfaces share a name', () => {
    const component = extractComponentApi(request('Button/index.mdx', 'Button'));

    expect(component.properties.find(({ name }) => name === 'sameNameInherited')).toMatchObject({
      inheritedFrom: 'ButtonProps',
      source: expect.objectContaining({ file: expect.stringMatching(/inherited\.ts$/) }),
    });
  });

  it('uses SymbolFlags.Optional, NoTruncation, resolved JSDoc, and literal defaults', () => {
    const component = extractComponentApi(request('Button/index.mdx', 'Button'));
    const mode = component.properties.find(({ name }) => name === 'mode');
    const tone = component.properties.find(({ name }) => name === 'tone');
    const legacy = component.properties.find(({ name }) => name === 'legacy');
    const requiredLabel = component.properties.find(({ name }) => name === 'requiredLabel');

    expect(mode?.type).toContain('omicron');
    expect(tone?.defaultValue).toBe('"neutral"');
    expect(legacy?.deprecated).toBe('Use `tone` instead.');
    expect(requiredLabel?.required).toBe(true);
    expect(requiredLabel?.source).toMatchObject({
      column: expect.any(Number),
      line: expect.any(Number),
    });
  });

  it('never lets a nested callback overwrite the component parameter default', () => {
    const component = extractComponentApi(
      request('Button/index.mdx', 'NestedDefaultButton', '../component'),
    );

    expect(component.properties.find(({ name }) => name === 'tone')?.defaultValue).toBe(
      '"neutral"',
    );
  });

  it('keys a renamed destructuring default by the public property name and detects conflicts', () => {
    expect(() =>
      extractComponentApi(
        request('Button/index.mdx', 'RenamedConflictingDefaultButton', '../component'),
      ),
    ).toThrow(
      /RenamedConflictingDefaultButton[\s\S]*active[\s\S]*runtime[\s\S]*true[\s\S]*@default[\s\S]*false/,
    );
  });

  it('does not attribute a nested binding initializer to its public object property', () => {
    const component = extractComponentApi(
      request('Button/index.mdx', 'NestedBindingDefaultButton', '../component'),
    );

    expect(component.properties.find(({ name }) => name === 'settings')?.defaultValue).toBe(
      undefined,
    );
  });

  it('collects a literal default through a real nested memo(forwardRef()) wrapper', () => {
    const component = extractComponentApi(
      request('Button/index.mdx', 'NestedForwardDefaultButton', '../component'),
    );

    expect(component.properties.find(({ name }) => name === 'tone')?.defaultValue).toBe(
      '"neutral"',
    );
  });

  it('follows a memo(ComponentWithDefaults) identifier wrapper', () => {
    const component = extractComponentApi(
      request('Button/index.mdx', 'MemoDefaultButton', '../component'),
    );

    expect(component.properties.find(({ name }) => name === 'active')?.defaultValue).toBe('true');
  });

  it('does not let an identifier wrapper hide a conflicting runtime default', () => {
    expect(() =>
      extractComponentApi(
        request('Button/index.mdx', 'MemoConflictingDefaultButton', '../component'),
      ),
    ).toThrow(
      /MemoConflictingDefaultButton[\s\S]*active[\s\S]*runtime[\s\S]*true[\s\S]*@default[\s\S]*false/,
    );
  });

  it('preserves a bare deprecated marker without inventing duplicate badge text', () => {
    const component = extractComponentApi(request('Button/index.mdx', 'Button'));

    expect(component.properties.find(({ name }) => name === 'bareLegacy')?.deprecated).toBe('');
  });

  it('treats safe single-quoted JSDoc and runtime string defaults as equivalent', () => {
    const component = extractComponentApi(
      request('Button/index.mdx', 'EquivalentDefaultButton', '../component'),
    );

    expect(component.properties.find(({ name }) => name === 'tone')?.defaultValue).toBe(
      '"neutral"',
    );
  });

  it('rejects conflicting JSDoc and runtime defaults', () => {
    expect(() =>
      extractComponentApi(request('Button/index.mdx', 'ConflictingDefaultButton', '../component')),
    ).toThrow(
      /ConflictingDefaultButton[\s\S]*active[\s\S]*runtime[\s\S]*true[\s\S]*@default[\s\S]*false/,
    );
  });

  it('rejects overloads with different props contracts', () => {
    expect(() =>
      extractComponentApi(request('Button/index.mdx', 'OverloadedButton', '../component')),
    ).toThrow(/OverloadedButton[\s\S]*multiple callable signatures[\s\S]*from=/);
  });

  it('distinguishes required and optional overload props under exactOptionalPropertyTypes', () => {
    expect(() =>
      extractComponentApi(
        request('Button/index.mdx', 'ExactOptionalOverloadedButton', '../component'),
      ),
    ).toThrow(/ExactOptionalOverloadedButton[\s\S]*multiple callable signatures[\s\S]*from=/);
  });

  it('includes index signatures when comparing overload props contracts', () => {
    expect(() =>
      extractComponentApi(request('Button/index.mdx', 'IndexOverloadedButton', '../component')),
    ).toThrow(/IndexOverloadedButton[\s\S]*multiple callable signatures[\s\S]*from=/);
  });
});

describe('props graph integrity', () => {
  it('fails with a related syntactic diagnostic instead of emitting a partial props table', () => {
    const invalidRequest = temporaryRequest(
      {
        'component.ts': `export interface BrokenProps { good: string; broken: }\nexport const BrokenPropsButton = (props: BrokenProps) => props.good;\n`,
        'index.ts': `export { BrokenPropsButton } from './component';\n`,
      },
      'BrokenPropsButton',
    );

    expect(() => extractComponentApi(invalidRequest)).toThrow(
      /index\.mdx[\s\S]*BrokenPropsButton[\s\S]*component\.ts[\s\S]*TS1110[\s\S]*resolve/i,
    );
  });

  it('fails with the related TypeScript diagnostic when a props import is unresolved', () => {
    const invalidRequest = temporaryRequest(
      {
        'component.ts': `import type { MissingProps } from './missing-props';\nexport const MissingPropsButton = (props: MissingProps) => props;\n`,
        'index.ts': `export { MissingPropsButton } from './component';\n`,
      },
      'MissingPropsButton',
    );

    expect(() => extractComponentApi(invalidRequest)).toThrow(
      /index\.mdx[\s\S]*MissingPropsButton[\s\S]*component\.ts[\s\S]*TS2307[\s\S]*missing-props[\s\S]*resolve/i,
    );
  });

  it.each([
    ['AnyPropsButton', 'any'],
    ['UnknownPropsButton', 'unknown'],
  ])('rejects an explicit error-like props contract on %s', (name, kind) => {
    const invalidRequest = temporaryRequest(
      {
        'component.ts': `export const ${name} = (props: ${kind}) => props;\n`,
        'index.ts': `export { ${name} } from './component';\n`,
      },
      name,
    );

    expect(() => extractComponentApi(invalidRequest)).toThrow(
      new RegExp(`${name}[\\s\\S]*(any|unknown)[\\s\\S]*props`, 'i'),
    );
  });

  it('does not fail a valid component because another program file has diagnostics', () => {
    const validRequest = temporaryRequest(
      {
        'component.ts': `export interface ValidProps { label: string }\nexport const ValidButton = (props: ValidProps) => props.label;\n`,
        'index.ts': `export { ValidButton } from './component';\n`,
        'unrelated.ts': `const unrelated: string = 123;\n`,
      },
      'ValidButton',
    );

    expect(extractComponentApi(validRequest).properties).toEqual([
      expect.objectContaining({ name: 'label', required: true, type: 'string' }),
    ]);
  });

  it('does not treat an unrelated component-body syntax error as a props graph failure', () => {
    const validRequest = temporaryRequest(
      {
        'component.ts': `export interface ValidProps { label: string }\nexport const ValidButton = (props: ValidProps) => { const unrelated = ; return props.label; };\n`,
        'index.ts': `export { ValidButton } from './component';\n`,
      },
      'ValidButton',
    );

    expect(extractComponentApi(validRequest).properties).toEqual([
      expect.objectContaining({ name: 'label', required: true, type: 'string' }),
    ]);
  });
});
