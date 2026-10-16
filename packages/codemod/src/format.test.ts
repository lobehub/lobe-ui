import { createReport, formatJson, formatMarkdown, formatText } from './format';
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
  it('prints a compact summary with the next action and report paths', () => {
    const text = formatText(result, {
      dry: false,
      artifacts: { markdown: '/tmp/report.md', json: '/tmp/report.json' },
    });
    expect(text).toContain('Tasks: 1 manual, 1 review. Parse errors: 1.');
    expect(text).toContain('start with src/broken.ts');
    expect(text).toContain('Markdown report: /tmp/report.md');
    expect(text).toContain('JSON report: /tmp/report.json');
    expect(text).not.toContain(result.items[1].message);
    expect(text).toContain('Rewrote 1 of 3 files. 1 item needs a manual fix, 1 info item.');
  });

  it('says "would rewrite" in dry mode', () => {
    expect(formatText({ ...result, errors: [], items: [] }, { dry: true })).toContain(
      'Would rewrite 1 of 3 files. 0 items need a manual fix.',
    );
  });

  it('warns that dry-run positions refer to the rewritten files', () => {
    expect(formatMarkdown({ ...result, errors: [] }, { dry: true })).toContain(
      'Line numbers refer to files after the mechanical transforms',
    );
  });

  it('renders a Markdown checklist with doc links', () => {
    const md = formatMarkdown(result);
    expect(md).toContain('## R4 Removed exports (1 task)');
    expect(md).toContain(result.items[0].message);
    expect(md).toContain('`src/b.ts:1:10`');
    expect(md).toContain('[guide](https://ui.lobehub.com/migration-v6#components)');
  });

  it('emits JSON that round-trips the result', () => {
    const parsed = JSON.parse(formatJson(result));
    expect(parsed.items).toHaveLength(2);
    expect(parsed.changed).toEqual(['src/a.tsx']);
    expect(parsed.diffs).toBeUndefined();
  });

  it('keeps DatePicker diagnostics in every report format', () => {
    const item = {
      ...result.items[0],
      rule: 'R12' as const,
      message: 'Use minDate instead of min.',
    };
    const report = { ...result, items: [item] };
    expect(formatMarkdown(report)).toContain(item.message);
    expect(JSON.parse(formatJson(report)).items[0].message).toBe(item.message);
    expect(JSON.parse(formatJson(report)).tasks[0].message).toBe(item.message);
  });

  it('still gives verification steps when there are no static findings', () => {
    const clean = { ...result, errors: [], items: [] };
    expect(formatText(clean, { dry: false })).toContain(
      'Next steps (manual verification required)',
    );
    expect(formatMarkdown(clean)).toContain('- [ ] Compare tests with a pre-upgrade baseline');
    const { nextSteps } = JSON.parse(formatJson(clean));
    expect(
      nextSteps.some((step: { message: string }) => step.message.includes('MotionProvider')),
    ).toBe(true);
    expect(nextSteps.some((step: { message: string }) => step.message.includes('light/dark'))).toBe(
      true,
    );
  });

  it('groups repeated hints while retaining every location and stable IDs', () => {
    const item = result.items[1];
    const second = { ...item, file: 'src/other.tsx', line: 50 };
    const grouped = createReport({ ...result, items: [item, second], errors: [] });
    expect(grouped.summary.reviewFindings).toBe(2);
    expect(grouped.summary.reviewTasks).toBe(1);
    expect(grouped.tasks).toHaveLength(1);
    expect(grouped.tasks[0].locations).toEqual([
      { file: item.file, line: item.line, column: item.column },
      { file: second.file, line: second.line, column: second.column },
    ]);
    const moved = createReport({ ...result, items: [{ ...second, line: 60 }, item], errors: [] });
    expect(moved.tasks[0].id).toBe(grouped.tasks[0].id);
    expect(grouped.items).toEqual([item, second]);
    expect(grouped.nextAction).toMatchObject({ kind: 'review', taskId: grouped.tasks[0].id });
  });

  it('distinguishes preview, manual fixes and runtime verification without declaring success', () => {
    const options = { dry: true, paths: ['src', 'tests'] };
    const preview = createReport({ ...result, errors: [] }, options);
    expect(preview).toMatchObject({
      schemaVersion: 1,
      mode: 'dry-run',
      scope: { paths: ['src', 'tests'], locationBasis: 'after-transforms' },
    });
    expect(preview.nextAction.kind).toBe('review-diff');
    const write = createReport({ ...result, errors: [], items: [...result.items].reverse() });
    expect(write.nextAction).toMatchObject({ kind: 'manual-fix', taskId: write.tasks[0].id });
    const clean = createReport({ changed: [], diffs: {}, files: 1, items: [], errors: [] });
    expect(clean.status).toBe('needs-verification');
    expect(clean.nextAction.kind).toBe('verify');
  });
});
