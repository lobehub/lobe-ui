// @vitest-environment node

import { compile } from '@mdx-js/mdx';

import { decodeApiVirtualRequest, remarkApi } from './remarkApi';

it('injects one serialized virtual JSON import per static Api node through the MDX AST', async () => {
  const path = '/workspace/src/Button/index.mdx';
  const output = String(
    await compile(
      { path, value: '<Api name="Button" />\n<Api name="Icon" from="../Icon" />' },
      {
        jsx: true,
        remarkPlugins: [remarkApi],
      },
    ),
  );
  const ids = [...output.matchAll(/virtual:lobe-docs\/api:([^"']+)/g)].map((match) => match[1]);

  expect(ids).toHaveLength(2);
  expect(ids.map(decodeApiVirtualRequest)).toEqual([
    { documentPath: path, name: 'Button' },
    { documentPath: path, from: '../Icon', name: 'Icon' },
  ]);
  expect(output).toContain('data={__lobe_docs_api_0}');
  expect(output).toContain('data={__lobe_docs_api_1}');
});

it('aggregates malformed Api nodes with MDX locations and author actions', async () => {
  await expect(
    compile(
      {
        path: '/workspace/docs/malformed.mdx',
        value: '<Api />\n<Api name={ComponentName} />\n<Api name="Button" from />',
      },
      { remarkPlugins: [remarkApi] },
    ),
  ).rejects.toThrow(
    /malformed\.mdx:1:1[\s\S]*name[\s\S]*static string[\s\S]*\n- [\s\S]*malformed\.mdx:2:1[\s\S]*name[\s\S]*static string[\s\S]*\n- [\s\S]*malformed\.mdx:3:1[\s\S]*from[\s\S]*static string/,
  );
});

it('avoids author bindings when generating injected identifiers', async () => {
  const output = String(
    await compile(
      {
        path: '/workspace/docs/collision.mdx',
        value: 'export const __lobe_docs_api_0 = "author binding";\n\n<Api name="Button" />',
      },
      { jsx: true, remarkPlugins: [remarkApi] },
    ),
  );
  const injected = output.match(
    /import\s+([A-Za-z_$][\w$]*)\s+from\s+["']virtual:lobe-docs\/api:/,
  )?.[1];

  expect(injected).toBeTruthy();
  expect(injected).not.toBe('__lobe_docs_api_0');
  expect(output).toContain(`data={${injected}}`);
});

it('rejects empty strings and an author-supplied data prop without silent overrides', async () => {
  await expect(
    compile(
      {
        path: '/workspace/docs/reserved.mdx',
        value:
          '<Api name="" />\n<Api name="Button" from="" />\n<Api name="Button" data={manual} />',
      },
      { remarkPlugins: [remarkApi] },
    ),
  ).rejects.toThrow(
    /reserved\.mdx:1:1[\s\S]*name[\s\S]*non-empty static string[\s\S]*\n- [\s\S]*reserved\.mdx:2:1[\s\S]*from[\s\S]*non-empty static string[\s\S]*\n- [\s\S]*reserved\.mdx:3:1[\s\S]*data[\s\S]*reserved[\s\S]*compiler/,
  );
});
