// @vitest-environment node

import { resolve } from 'node:path';

import { extractComponentApis } from './diagnostics';

const fixtureRoot = resolve(import.meta.dirname, '../../../../../tests/fixtures/site/api');
const tsconfigPath = resolve(fixtureRoot, 'tsconfig.json');

it('aggregates malformed and unresolved API requests with corrective actions', () => {
  expect(() =>
    extractComponentApis([
      {
        documentPath: resolve(fixtureRoot, 'Button/index.mdx'),
        name: '',
        tsconfigPath,
      },
      {
        documentPath: resolve(fixtureRoot, 'Button/index.mdx'),
        from: '../missing',
        name: 'MissingButton',
        tsconfigPath,
      },
    ]),
  ).toThrow(
    /API extraction failed:\n- [\s\S]*Button\/index\.mdx[\s\S]*non-empty name[\s\S]*\n- [\s\S]*Button\/index\.mdx[\s\S]*MissingButton[\s\S]*from=[\s\S]*\.\.\/missing[\s\S]*could not be resolved/,
  );
});
