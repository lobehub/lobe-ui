import { applyTransforms } from '../../transform';
import { v6Transforms } from '.';

const input = [
  `import { Button } from '@lobehub/ui/base-ui';`,
  `import { createStaticStyles, cx, StyleProvider } from 'antd-style';`,
  `import type { Theme } from 'antd-style';`,
  `import { Flexbox } from '@lobehub/ui';`,
  `export const f = (t: Theme) => cx(t.colorText);`,
].join('\n');

describe('v6Transforms', () => {
  it('runs every transform and merges the resulting imports', () => {
    expect(applyTransforms(input, 'a.tsx', v6Transforms).code).toBe(
      [
        `import { Button, createStaticStyles, cx, Flexbox } from '@lobehub/ui';`,
        `import { StyleProvider } from 'antd-style';`,
        `import type { LobeTheme } from '@lobehub/ui';`,
        `export const f = (t: LobeTheme) => cx(t.colorText);`,
      ].join('\n'),
    );
  });

  it('is idempotent', () => {
    const once = applyTransforms(input, 'a.tsx', v6Transforms).code;
    expect(applyTransforms(once, 'a.tsx', v6Transforms)).toEqual({ changed: false, code: once });
  });
});
