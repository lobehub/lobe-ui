import { extractMdxProse } from './mdxProse';

it('keeps authored markdown and drops component imports and tags', () => {
  const prose = extractMdxProse(`---
title: Button
description: Triggers an action.
category: General
---

import Basic from './demos/index.tsx?demo';

## Introduction

Button starts an action.

## Example

<Demo of={Basic} title="Basic" layout="bare" />

## API

<Api name="Button" />

Use \`type\` to pick a variant.

\`\`\`tsx
<Demo of={Basic} />
\`\`\`
`);

  expect(prose.prose).toBe(`## Introduction

Button starts an action.

## API

Use \`type\` to pick a variant.

\`\`\`tsx
<Demo of={Basic} />
\`\`\``);
  expect(prose.headings).toEqual(['Introduction', 'API']);
  expect(prose.prose).not.toContain('import ');
  expect(prose.prose).not.toMatch(/<Api/);
});
