// @vitest-environment node

import { resolve } from 'node:path';

import { extractComponentApi } from './extractComponent';

const fixtureRoot = resolve(import.meta.dirname, '../../../tests/fixtures/site/api');
const tsconfigPath = resolve(fixtureRoot, 'tsconfig.json');
const request = (document: string, name: string, from?: string) => ({
  documentPath: resolve(fixtureRoot, document),
  from,
  name,
  tsconfigPath,
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
});
