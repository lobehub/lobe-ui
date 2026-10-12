import { applyTransforms } from '../../transform';
import { baseUiSubpath } from './baseUiSubpath';

const run = (code: string) => applyTransforms(code, 'a.tsx', [baseUiSubpath]).code;

describe('baseUiSubpath', () => {
  it('rewrites static imports and re-exports', () => {
    expect(
      run(
        [
          `import { Button } from '@lobehub/ui/base-ui';`,
          `import { Form } from "@lobehub/ui/base-ui/form";`,
          `export { Select } from '@lobehub/ui/base-ui';`,
          `export * from '@lobehub/ui/base-ui';`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `import { Button } from '@lobehub/ui';`,
        `import { Form } from "@lobehub/ui/form";`,
        `export { Select } from '@lobehub/ui';`,
        `export * from '@lobehub/ui';`,
      ].join('\n'),
    );
  });

  it('rewrites dynamic imports and test mocks', () => {
    expect(
      run(
        [
          `const m = await import('@lobehub/ui/base-ui');`,
          `vi.mock('@lobehub/ui/base-ui', () => ({}));`,
          `jest.mock('@lobehub/ui/base-ui/form');`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `const m = await import('@lobehub/ui');`,
        `vi.mock('@lobehub/ui', () => ({}));`,
        `jest.mock('@lobehub/ui/form');`,
      ].join('\n'),
    );
  });

  it('keeps a base-ui mock when the target module is already mocked', () => {
    const code = [
      `vi.mock('@lobehub/ui', () => ({ copyToClipboard: vi.fn() }));`,
      `vi.mock('@lobehub/ui/base-ui', () => ({ Button: () => null }));`,
    ].join('\n');
    expect(run(code)).toBe(code);
  });

  it('leaves other sources alone', () => {
    const code = `import { Menu } from '@base-ui/react';\nimport x from '@lobehub/ui/base-ui-extra';`;
    expect(run(code)).toBe(code);
  });
});
