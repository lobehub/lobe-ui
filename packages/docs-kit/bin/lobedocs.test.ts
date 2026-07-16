import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.join(currentDirectory, 'lobedocs.mjs');
const packageRoot = path.join(currentDirectory, '..');

describe('lobedocs bin', () => {
  it('prints the usage line and exits non-zero for an unknown command', () => {
    const result = spawnSync(process.execPath, [binPath, 'not-a-real-command'], {
      cwd: packageRoot,
      encoding: 'utf8',
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('Unknown lobedocs command: not-a-real-command');
    expect(result.stderr).toContain('Usage: lobedocs <build|dev|typegen> [...args]');
  });
});
