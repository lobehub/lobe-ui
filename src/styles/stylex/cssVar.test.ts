import { readFileSync } from 'node:fs';

import { renderStylexVars, stylexVarsPath } from '../../../scripts/buildStylexVars';
import { getThemeCss } from '../theme/themeCss';

describe('cssVar.stylex.ts', () => {
  const source = readFileSync(stylexVarsPath, 'utf8');

  it('matches the generator output', () => {
    expect(source).toBe(renderStylexVars());
  });

  it('only references variables defined in theme.css', () => {
    const defined = new Set(getThemeCss().match(/--lobe-[\w-]+(?=:)/g));
    const missing = [...source.matchAll(/var\((--lobe-[\w-]+)\)/g)]
      .map(([, name]) => name)
      .filter((name) => !defined.has(name));
    expect(missing).toEqual([]);
  });
});
