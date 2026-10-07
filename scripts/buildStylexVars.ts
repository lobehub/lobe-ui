import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { cssVar } from '../src/styles/css';

export const stylexVarsPath = path.resolve(
  import.meta.dirname,
  '../src/styles/stylex/cssVar.stylex.ts',
);

export const renderStylexVars = () =>
  `import * as stylex from '@stylexjs/stylex';

export const cssVar = stylex.defineConsts({
${Object.entries(cssVar)
  .map(([key, value]) => `  ${key}: '${value}',`)
  .join('\n')}
});
`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(stylexVarsPath, renderStylexVars());
}
