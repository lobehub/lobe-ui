import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { scanAntdUsage } from './scan';

const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'static-css-scan-'));

afterAll(() => {
  rmSync(fixtureRoot, { force: true, recursive: true });
});

const writeFixture = (name: string, content: string) => {
  writeFileSync(path.join(fixtureRoot, name), content, 'utf8');
};

describe('scanAntdUsage', () => {
  it('collects named value imports, strips aliases and type specifiers', () => {
    writeFixture(
      'named.tsx',
      `import { Button, type ButtonProps, Tag as AntTag } from 'antd';\n` +
        `import type { ModalProps } from 'antd';\n`,
    );

    const result = scanAntdUsage({ cwd: fixtureRoot, roots: ['.'] });

    expect(result.components).toContain('Button');
    expect(result.components).toContain('Tag');
    expect(result.components).not.toContain('ButtonProps');
    expect(result.components).not.toContain('ModalProps');
    expect(result.components).not.toContain('AntTag');
  });

  it('handles multiline named imports without crossing statements', () => {
    writeFixture(
      'multiline.ts',
      `import { A } from 'other';\nimport {\n  Select,\n  Slider,\n} from 'antd';\n`,
    );

    const result = scanAntdUsage({ cwd: fixtureRoot, roots: ['.'] });

    expect(result.components).toContain('Select');
    expect(result.components).toContain('Slider');
    expect(result.components).not.toContain('A');
  });

  it('maps deep imports to pascal-case component names', () => {
    writeFixture(
      'deep.ts',
      `import TextArea from 'antd/es/input/TextArea';\nimport tokens from 'antd/lib/input-number/style/token';\n`,
    );

    const result = scanAntdUsage({ cwd: fixtureRoot, roots: ['.'] });

    expect(result.components).toContain('Input');
    expect(result.components).toContain('InputNumber');
  });

  it('flags namespace and default imports as wildcard', () => {
    writeFixture('wildcard.ts', `import * as antd from 'antd';\n`);

    const result = scanAntdUsage({ cwd: fixtureRoot, roots: ['.'] });

    expect(result.wildcard).toBe(true);
  });

  it('detects @lobehub/ui imports', () => {
    writeFixture('lobe.ts', `import { Modal } from '@lobehub/ui';\n`);

    const result = scanAntdUsage({ cwd: fixtureRoot, roots: ['.'] });

    expect(result.importsLobeUi).toBe(true);
    expect(result.components).not.toContain('Modal');
  });
});
