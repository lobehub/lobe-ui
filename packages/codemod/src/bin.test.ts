import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

it.each([false, true])(
  'flushes large JSON reports before exiting (parse failure: %s)',
  (broken) => {
    const dir = mkdtempSync(path.join(tmpdir(), 'lobe-ui-codemod-stdout-'));
    try {
      writeFileSync(
        path.join(dir, 'selectors.ts'),
        ['const selectors = [', ...Array.from({ length: 500 }, () => "'.ant-app',"), '];'].join(
          '\n',
        ),
      );
      if (broken) writeFileSync(path.join(dir, 'broken.ts'), "import 'antd-style'; const = ;");
      const result = spawnSync(
        process.execPath,
        [
          '--import',
          import.meta.resolve('tsx'),
          path.join(import.meta.dirname, 'bin.ts'),
          'v6',
          '.',
          '--dry',
          '--json',
        ],
        { cwd: dir, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 },
      );
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(broken ? 1 : 0);
      expect(Buffer.byteLength(result.stdout)).toBeGreaterThan(64 * 1024);
      const report = JSON.parse(result.stdout);
      expect(report.items.filter((item: { rule: string }) => item.rule === 'R9')).toHaveLength(500);
      expect(report.errors).toHaveLength(broken ? 1 : 0);
      expect(report.nextSteps.length).toBeGreaterThan(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  },
);
