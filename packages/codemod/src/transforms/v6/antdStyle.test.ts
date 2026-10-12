import { applyTransforms } from '../../transform';
import { antdStyle } from './antdStyle';

const run = (code: string, filename = 'a.tsx') => applyTransforms(code, filename, [antdStyle]).code;

describe('antdStyle', () => {
  it('moves a fully supported import to @lobehub/ui', () => {
    expect(run(`import { createStaticStyles, cssVar, cx } from 'antd-style';`)).toBe(
      `import { createStaticStyles, cssVar, cx } from '@lobehub/ui';`,
    );
  });

  it('keeps aliases', () => {
    expect(run(`import { cx as clsx, useTheme } from "antd-style";`)).toBe(
      `import { cx as clsx, useTheme } from "@lobehub/ui";`,
    );
  });

  it('splits unsupported names into a remaining antd-style import', () => {
    expect(run(`import { StyleProvider, cx, createStyles } from 'antd-style';`)).toBe(
      [
        `import { cx } from '@lobehub/ui';`,
        `import { StyleProvider, createStyles } from 'antd-style';`,
      ].join('\n'),
    );
  });

  it('leaves an import with only unsupported names untouched', () => {
    const code = `import { ThemeProvider } from 'antd-style';`;
    expect(run(code)).toBe(code);
  });

  it('renames Theme and ThemeAppearance types and their references', () => {
    expect(
      run(
        [
          `import type { Theme, ThemeAppearance } from 'antd-style';`,
          `const f = (t: Theme, a: ThemeAppearance): Theme => t;`,
          `const o = { Theme: 1 };`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `import type { LobeTheme, LobeAppearance } from '@lobehub/ui';`,
        `const f = (t: LobeTheme, a: LobeAppearance): LobeTheme => t;`,
        `const o = { Theme: 1 };`,
      ].join('\n'),
    );
  });

  it('renames inline type specifiers', () => {
    expect(
      run([`import { type Theme, cx } from 'antd-style';`, `let t: Theme;`].join('\n'), 'a.ts'),
    ).toBe([`import { type LobeTheme, cx } from '@lobehub/ui';`, `let t: LobeTheme;`].join('\n'));
  });

  it('keeps the local name when Theme is aliased', () => {
    expect(run(`import type { Theme as T } from 'antd-style';\nlet t: T;`)).toBe(
      `import type { LobeTheme as T } from '@lobehub/ui';\nlet t: T;`,
    );
  });

  it('skips the rename when the target name is already bound', () => {
    expect(
      run(
        [
          `import type { Theme } from 'antd-style';`,
          `import type { LobeTheme } from './theme';`,
          `let t: Theme;`,
        ].join('\n'),
      ),
    ).toBe(
      [
        `import type { Theme } from 'antd-style';`,
        `import type { LobeTheme } from './theme';`,
        `let t: Theme;`,
      ].join('\n'),
    );
  });

  it.each([
    [
      'a type parameter',
      `import type { Theme } from 'antd-style';\ninterface P<Theme> { t: Theme }\nlet x: Theme;`,
    ],
    [
      'a nested declaration',
      `import type { Theme } from 'antd-style';\nnamespace N { interface Theme {} let y: Theme; }\nlet x: Theme;`,
    ],
    ['a re-export', `import type { Theme } from 'antd-style';\nexport type { Theme };`],
  ])('skips the Theme rename when the name is shadowed by %s', (_, code) => {
    expect(run(code, 'a.ts')).toBe(code);
  });

  it('never rewrites namespace or default imports', () => {
    const code = `import * as styles from 'antd-style';\nimport antdStyle from 'antd-style';`;
    expect(run(code)).toBe(code);
  });
});
