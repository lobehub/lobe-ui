import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { AtomDirConfig } from '../../../src/config';
import { createContentManifest } from '../content/createManifest';
import { assembleAgentDocs, skillNameFromTitle } from './assembleAgentDocs';
import { readDocumentProse } from './readDocumentProse';

const atomDirs: AtomDirConfig[] = [{ dir: 'src' }];
const temporaryRoots: string[] = [];

const writeFiles = (root: string, files: Record<string, string>): void => {
  for (const [relativePath, contents] of Object.entries(files)) {
    const absolutePath = path.resolve(root, relativePath);
    mkdirSync(path.dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, contents);
  }
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

it('derives a skill name from any site title', () => {
  expect(skillNameFromTitle('Editor Kit')).toBe('editor-kit');
  expect(skillNameFromTitle('---')).toBe('docs');
});

it('assembles both files from config, component folders, and MDX prose', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'lobedocs-agent-docs-'));
  temporaryRoots.push(root);
  writeFiles(root, {
    'docs/index.mdx': `---
title: Home
description: Documentation home.
---

Welcome to the kit.
`,
    'src/Button/index.mdx': `---
title: Button
description: Triggers an action.
category: Actions
order: 2
---

import Basic from './demos/index.tsx?demo';

## Introduction

Button starts an action.

<Demo of={Basic} />
`,
    'src/base-ui/Button/index.mdx': `---
title: Button
description: Base button.
category: General
order: 1
---

Base button notes.
`,
    'src/plugins/Common/index.mdx': `---
title: Common
description: Shared helpers.
category: General
---

Shared helper notes.
`,
  });

  const site = {
    atomDirs,
    description: 'A component kit.',
    install: 'pnpm add @example/ui',
    navSections: { 'src/plugins/Common/index.mdx': 'Shared' },
    origin: 'https://docs.example.test',
    packageName: '@example/ui',
    repository: 'https://github.com/example/ui',
    title: 'Editor Kit',
  };
  const { documents } = createContentManifest(root, atomDirs, site.navSections);
  const assembled = assembleAgentDocs({
    documents,
    proseBySource: readDocumentProse(root, documents),
    site,
  });

  expect(assembled.llmsTxt.startsWith('# Editor Kit\n')).toBe(true);
  expect(assembled.llmsTxt).toContain('> A component kit.');
  expect(assembled.llmsTxt).toContain('## src');
  expect(assembled.llmsTxt).toContain('## base-ui');
  expect(assembled.llmsTxt).toContain('## Shared');
  expect(assembled.llmsTxt).not.toContain('## plugins');
  expect(assembled.llmsTxt).toContain(
    '[Button](https://docs.example.test/skills/components/button.md): Category: Actions. Triggers an action. Outline: Introduction. Docs: https://docs.example.test/components/button',
  );
  expect(assembled.llmsTxt).toContain(
    'https://docs.example.test/skills/components/base-ui/button.md',
  );
  expect(assembled.llmsTxt).toContain('[Home](https://docs.example.test/)');
  expect(assembled.llmsTxt.indexOf('## src')).toBeLessThan(assembled.llmsTxt.indexOf('## base-ui'));
  expect(assembled.llmsTxt.indexOf('## base-ui')).toBeLessThan(
    assembled.llmsTxt.indexOf('## Shared'),
  );
  expect(assembled.llmsTxt.indexOf('## Shared')).toBeLessThan(
    assembled.llmsTxt.indexOf('## Optional'),
  );

  expect(assembled.skillsMd).toContain('name: editor-kit');
  expect(assembled.skillsMd).toContain('- Package: `@example/ui`');
  expect(assembled.skillsMd).toContain('- Repository: https://github.com/example/ui');
  expect(assembled.skillsMd).toContain('pnpm add @example/ui');
  expect(assembled.skillsMd).toContain('https://docs.example.test/llms.txt');
  expect(assembled.skillsMd).toContain(
    '- [Button](https://docs.example.test/skills/components/button.md) — Triggers an action.',
  );
  expect(assembled.skillsMd).toContain(
    'https://docs.example.test/skills/components/base-ui/button.md',
  );
  expect(assembled.skillsMd).not.toContain('Button starts an action.');
  expect(assembled.skillsMd).not.toContain('Welcome to the kit.');

  expect(assembled.pages.map(({ pathname }) => pathname).toSorted()).toEqual([
    '/skills/components/base-ui/button.md',
    '/skills/components/button.md',
    '/skills/components/plugins/common.md',
  ]);
  const button = assembled.pages.find(
    ({ pathname }) => pathname === '/skills/components/button.md',
  );
  expect(button?.markdown.startsWith('# Button\n\n> Triggers an action.\n')).toBe(true);
  expect(button?.markdown).toContain('- Source: `src/Button/index.mdx`');
  expect(button?.markdown).toContain('- Docs: https://docs.example.test/components/button');
  expect(button?.markdown).toContain('Button starts an action.');
  expect(button?.markdown).not.toContain('import ');
  expect(button?.markdown).not.toContain('<Demo');
});

it('shortens index descriptions to their first sentence', () => {
  const { skillsMd } = assembleAgentDocs({
    documents: [
      {
        description: 'Shows a toast. It stacks and auto-dismisses after a timeout.',
        pathname: '/components/toast',
        source: 'src/Toast/index.mdx',
        title: 'Toast',
      },
    ],
    proseBySource: new Map(),
    site: {
      atomDirs,
      description: 'Kit.',
      navSections: {},
      origin: 'https://docs.example.test',
      title: 'Kit',
    },
  });

  expect(skillsMd).toContain(
    '- [Toast](https://docs.example.test/skills/components/toast.md) — Shows a toast.\n',
  );
});
