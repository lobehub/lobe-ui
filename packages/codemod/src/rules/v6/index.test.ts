import { collectReport } from '../../report';
import { v6Rules } from '.';

const report = (code: string, filename = 'a.tsx') =>
  collectReport(code, filename, v6Rules).map(({ line, rule }) => `${rule}:${line}`);

describe('v6Rules', () => {
  it('R1 flags ThemeProvider from @lobehub/ui and antd-style', () => {
    expect(
      report(
        [
          `import { ThemeProvider, Button } from '@lobehub/ui';`,
          `import { ThemeProvider as TP } from 'antd-style';`,
        ].join('\n'),
      ),
    ).toEqual(['R1:1', 'R5:1', 'R1:2']);
  });

  it('R2 flags StyleProvider', () => {
    expect(
      report(
        [
          `import { StyleProvider } from 'antd-style';`,
          `import { StyleProvider as S } from '@ant-design/cssinjs';`,
        ].join('\n'),
      ),
    ).toEqual(['R2:1', 'R2:2']);
  });

  it('R3 flags static-css imports and removed token helpers', () => {
    expect(
      report(
        [
          `import { lobeStaticCss } from '@lobehub/ui/static-css/vite';`,
          `import { lobeCustomToken, lobeStaticStylish } from '@lobehub/ui';`,
        ].join('\n'),
      ),
    ).toEqual(['R3:1', 'R3:2']);
  });

  it('R4 flags removed exports with their replacement', () => {
    const items = collectReport(
      `import { Dropdown, Toc, Flexbox } from '@lobehub/ui';`,
      'a.tsx',
      v6Rules,
    );
    expect(items.map((i) => [i.rule, i.message])).toEqual([
      ['R4', '`Dropdown` was removed from @lobehub/ui. Use DropdownMenu.'],
      ['R4', '`Toc` was removed from @lobehub/ui and has no successor.'],
    ]);
  });

  it('R4 flags value imports of names that became type-only, not type imports', () => {
    expect(
      report(
        [
          `import { ListItem } from '@lobehub/ui';`,
          `import type { ListItem as L } from '@lobehub/ui';`,
          `import { type ListItem as M } from '@lobehub/ui';`,
        ].join('\n'),
      ),
    ).toEqual(['R4:1']);
  });

  it('R5 marks components whose implementation changed as info', () => {
    const [item] = collectReport(`import { Modal } from '@lobehub/ui';`, 'a.tsx', v6Rules);
    expect([item.rule, item.level]).toEqual(['R5', 'info']);
  });

  it('R5 skips names the original file already imported from the base-ui subpath', () => {
    const items = collectReport(`import { Modal, Select } from '@lobehub/ui';`, 'a.tsx', v6Rules, {
      baseUiNames: new Set(['Modal']),
    });
    expect(items.map((i) => i.message.split('`')[1])).toEqual(['Select']);
  });

  it('R6 flags antd family imports with per-name hints', () => {
    const items = collectReport(
      [
        `import { Card, message, Watermark } from 'antd';`,
        `import Icon from '@ant-design/icons';`,
        `import RcTable from 'rc-table';`,
        `import { createStyles } from 'antd-style';`,
      ].join('\n'),
      'a.tsx',
      v6Rules,
    );
    expect(items.map((i) => `${i.rule}:${i.line} ${i.message}`)).toEqual([
      'R6:1 antd `Card` → Block (or Surface from @lobehub/ui/dashboard).',
      'R6:1 antd `message` → toast.',
      'R6:1 antd `Watermark` has no @lobehub/ui equivalent; rebuild it or drop it.',
      'R6:2 `@ant-design/icons` is not part of the @lobehub/ui stack; use lucide-react icons with Icon.',
      'R6:3 `rc-table` is an antd internal; replace it with the matching @lobehub/ui component.',
      'R6:4 antd-style `createStyles` has no @lobehub/ui equivalent; rewrite with createStaticStyles + cssVar.',
    ]);
  });

  it('R6 gives specific hints for antd reset, locales and cssinjs', () => {
    const items = collectReport(
      [
        `import 'antd/dist/reset.css';`,
        `import enUS from 'antd/locale/en_US';`,
        `import { createCache, extractStyle } from '@ant-design/cssinjs';`,
      ].join('\n'),
      'a.tsx',
      v6Rules,
    );
    expect(items.map((i) => i.message)).toEqual([
      '`antd/dist/reset.css` → import `@lobehub/ui/global.css` instead; it includes the antd reset.',
      '`antd/locale/en_US` is not needed; component strings come from ConfigProvider `resources` / `locale`.',
      '`@ant-design/cssinjs` only extracted antd styles for SSR; remove it, theme.css and style.css are static.',
    ]);
  });

  it('R6 covers every other way antd-style and antd are referenced', () => {
    expect(
      report(
        [
          `import 'antd-style';`,
          `import type { T } from 'antd-style/lib/types/theme';`,
          `declare module 'antd-style' {}`,
          `const s = require('antd-style');`,
          `export { cx, createStyles } from 'antd-style';`,
          `export * from 'antd-style';`,
          `const a = import('antd');`,
        ].join('\n'),
        'a.ts',
      ),
    ).toEqual(['R6:1', 'R6:2', 'R6:3', 'R6:4', 'R6:5', 'R6:6', 'R6:7']);
  });

  it('R1 and R4 also apply to re-exports from @lobehub/ui', () => {
    expect(report(`export { ThemeProvider, Footer, Flexbox } from '@lobehub/ui';`)).toEqual([
      'R1:1',
      'R4:1',
    ]);
  });

  it('R6 explains why a Theme type was left in antd-style', () => {
    const [item] = collectReport(`import type { Theme } from 'antd-style';`, 'a.ts', v6Rules);
    expect(item.message).toBe(
      'antd-style `Theme` → `LobeTheme` from @lobehub/ui. Not rewritten because the name is shadowed, re-exported or already taken in this file.',
    );
  });

  it('R8 flags themeMode / setThemeMode and stylish destructuring', () => {
    expect(
      report(
        [
          `import { useTheme, useThemeMode } from '@lobehub/ui';`,
          `const { themeMode, isDarkMode } = useThemeMode();`,
          `const { setThemeMode } = useThemeMode();`,
          `const { stylish, colorText } = useTheme();`,
        ].join('\n'),
      ),
    ).toEqual(['R8:2', 'R8:3', 'R8:4']);
  });

  it('R9 flags .ant- selectors and --ant- variables in strings and templates', () => {
    expect(
      report(
        [
          'const a = document.querySelector(".ant-app");',
          'const b = css`color: var(--ant-color-text);`;',
          "const c = 'grant-access';",
        ].join('\n'),
        'a.ts',
      ),
    ).toEqual(['R9:1', 'R9:2']);
  });

  it('flags removed subpaths mentioned in plain strings', () => {
    expect(
      report(
        [
          `export default { optimizeDeps: { include: ['@lobehub/ui', '@lobehub/ui/base-ui'] } };`,
          `const map = { '@lobehub/ui/static-css/vite': plugin };`,
        ].join('\n'),
        'vite.config.ts',
      ),
    ).toEqual(['R4:1', 'R3:2']);
  });

  it('flags a base-ui mock left next to an existing mock of the target', () => {
    expect(
      report(
        [`vi.mock('@lobehub/ui', () => ({}));`, `vi.mock('@lobehub/ui/base-ui', () => ({}));`].join(
          '\n',
        ),
        'a.test.ts',
      ),
    ).toEqual(['R4:2']);
  });

  it('R9 names the real portal host id', () => {
    const [item] = collectReport('const a = ".ant-app";', 'a.ts', v6Rules);
    expect(item.message).toContain(
      '`#lobe-ui-theme-app` (`document.getElementById(LOBE_THEME_APP_ID)`)',
    );
  });

  it('R10 flags removed v5 Video props, following the local name', () => {
    const items = collectReport(
      [
        `import { Video as LobeVideo } from '@lobehub/ui';`,
        `const a = <LobeVideo preview={false} src="a.mp4" variant="outlined" />;`,
        `const b = <video preview />;`,
      ].join('\n'),
      'a.tsx',
      v6Rules,
    );
    expect(items.map((i) => `${i.rule}:${i.line}`)).toEqual(['R5:1', 'R10:2', 'R10:2']);
    expect(items[1].message).toContain('`preview`');
    expect(items[2].message).toContain('Block');
  });

  it('reports nothing for clean v6 code', () => {
    expect(
      report(
        [
          `import '@lobehub/ui/theme.css';`,
          `import { cx, Flexbox, setLobeTheme } from '@lobehub/ui';`,
          `import { Form } from '@lobehub/ui/form';`,
        ].join('\n'),
      ),
    ).toEqual([]);
  });
});
