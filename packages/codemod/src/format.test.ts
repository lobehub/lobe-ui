import { formatJson, formatMarkdown, formatText } from './format';
import type { RunResult } from './run';

const result: RunResult = {
  changed: ['src/a.tsx'],
  diffs: {},
  errors: [{ file: 'src/broken.ts', message: 'Unexpected token (1:8)' }],
  files: 3,
  items: [
    {
      anchor: 'https://ui.lobehub.com/migration-v6#components',
      column: 10,
      file: 'src/b.ts',
      level: 'error',
      line: 1,
      message: '`Dropdown` was removed from @lobehub/ui. Use DropdownMenu.',
      rule: 'R4',
      snippet: "import { Dropdown } from '@lobehub/ui';",
    },
    {
      anchor: 'https://ui.lobehub.com/migration-v6#components',
      column: 10,
      file: 'src/c.tsx',
      level: 'info',
      line: 2,
      message: '`Modal` is now the base-ui implementation; its props changed.',
      rule: 'R5',
      snippet: "import { Modal } from '@lobehub/ui';",
    },
  ],
};

describe('format', () => {
  it('groups text output by rule and ends with a summary', () => {
    expect(formatText(result, { dry: false })).toBe(
      [
        'R4 Removed exports (1)',
        '  src/b.ts:1:10  `Dropdown` was removed from @lobehub/ui. Use DropdownMenu.',
        '',
        'R5 Changed components (1, info)',
        '  src/c.tsx:2:10  `Modal` is now the base-ui implementation; its props changed.',
        '',
        'Parse errors (1)',
        '  src/broken.ts  Unexpected token (1:8)',
        '',
        'Rewrote 1 of 3 files. 1 item needs a manual fix, 1 info item.',
        'Guide: https://ui.lobehub.com/migration-v6',
      ].join('\n'),
    );
  });

  it('says "would rewrite" in dry mode', () => {
    expect(formatText({ ...result, errors: [], items: [] }, { dry: true })).toContain(
      'Would rewrite 1 of 3 files. 0 items need a manual fix.',
    );
  });

  it('warns that dry-run positions refer to the rewritten files', () => {
    expect(formatText({ ...result, errors: [] }, { dry: true })).toContain(
      'Line numbers refer to the rewritten files.',
    );
  });

  it('renders a Markdown checklist with doc links', () => {
    const md = formatMarkdown(result);
    expect(md).toContain('## R4 Removed exports (1)');
    expect(md).toContain(
      '- [ ] `src/b.ts:1:10` `Dropdown` was removed from @lobehub/ui. Use DropdownMenu. ([guide](https://ui.lobehub.com/migration-v6#components))',
    );
  });

  it('emits JSON that round-trips the result', () => {
    const parsed = JSON.parse(formatJson(result));
    expect(parsed.items).toHaveLength(2);
    expect(parsed.changed).toEqual(['src/a.tsx']);
    expect(parsed.diffs).toBeUndefined();
  });
});
