import { applyTransforms } from '../../transform';
import { mergeImports } from './mergeImports';
import { splineSubpath } from './splineSubpath';

const run = (code: string) => applyTransforms(code, 'a.tsx', [splineSubpath, mergeImports]).code;

describe('splineSubpath', () => {
  it('moves whole imports to @lobehub/ui/spline', () => {
    expect(
      run(
        [
          `import { Spline, type SplineProps } from '@lobehub/ui/awesome';`,
          `import { LogoSpline, LogoThree } from "@lobehub/ui/brand";`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `import { Spline, type SplineProps, LogoSpline, LogoThree } from '@lobehub/ui/spline';`,
      ].join('\n'),
    );
  });

  it('splits mixed imports and keeps the rest on the original entry', () => {
    expect(
      run(`import { LobeHub, LogoThree, type LogoThreeProps } from '@lobehub/ui/brand';`),
    ).toBe(
      [
        `import { LogoThree, type LogoThreeProps } from '@lobehub/ui/spline';`,
        `import { LobeHub } from '@lobehub/ui/brand';`,
      ].join('\n'),
    );
    expect(run(`import type { SplineProps, SpotlightProps } from '@lobehub/ui/awesome';`)).toBe(
      [
        `import type { SplineProps } from '@lobehub/ui/spline';`,
        `import type { SpotlightProps } from '@lobehub/ui/awesome';`,
      ].join('\n'),
    );
  });

  it('moves re-exports', () => {
    expect(run(`export { Spline, Spotlight } from '@lobehub/ui/awesome';`)).toBe(
      [
        `export { Spline } from '@lobehub/ui/spline';`,
        `export { Spotlight } from '@lobehub/ui/awesome';`,
      ].join('\n'),
    );
  });

  it('rewrites deep es paths in imports, dynamic imports and mocks', () => {
    expect(
      run(
        [
          `import LogoThree from '@lobehub/ui/es/brand/LogoThree/index';`,
          `import type { LogoThreeProps } from '@lobehub/ui/es/brand/LogoThree';`,
          `const m = () => import('@lobehub/ui/es/awesome/Spline/Spine');`,
          `vi.mock('@lobehub/ui/es/brand/LogoThree/LogoSpline');`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `import LogoThree from '@lobehub/ui/es/spline/LogoThree/index';`,
        `import type { LogoThreeProps } from '@lobehub/ui/es/spline/LogoThree';`,
        `const m = () => import('@lobehub/ui/es/spline/Spline/Spine');`,
        `vi.mock('@lobehub/ui/es/spline/LogoThree/LogoSpline');`,
      ].join('\n'),
    );
  });

  it('leaves unrelated imports, aliases and lookalike paths alone', () => {
    const code = [
      `import { Spotlight } from '@lobehub/ui/awesome';`,
      `import { LobeHub } from '@lobehub/ui/brand';`,
      `import { Spline } from 'some-other-lib';`,
      `import x from '@lobehub/ui/es/brand/LogoThreeLegacy';`,
    ].join('\n');
    expect(run(code)).toBe(code);
  });

  it('keeps local aliases when moving', () => {
    expect(run(`import { Spline as Scene, Spotlight } from '@lobehub/ui/awesome';`)).toBe(
      [
        `import { Spline as Scene } from '@lobehub/ui/spline';`,
        `import { Spotlight } from '@lobehub/ui/awesome';`,
      ].join('\n'),
    );
  });
});
