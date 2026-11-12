import { readFileSync } from 'node:fs';
import path from 'node:path';

import { render } from '@testing-library/react';

import Table from '@/Table';

import Surface from './Surface';

const css = readFileSync(
  path.resolve(process.cwd(), 'src/dashboard/Surface/style.css'),
  'utf8',
).replaceAll(/\/\*[\s\S]*?\*\//g, '');

const bleedRules = [...css.matchAll(/([^{}]*lobe-surface-table-bleed[^{}]*)\{/g)].map((match) =>
  match[1]!.replaceAll(/\s+/g, ' ').trim(),
);

const columns = [{ dataIndex: 'name', key: 'name', title: 'Name' }];

describe('Surface table bleed', () => {
  test('selectors avoid :has(), which restyles the page on every DOM insertion', () => {
    expect(bleedRules.length).toBeGreaterThan(0);
    expect(bleedRules.filter((selector) => selector.includes(':has('))).toEqual([]);
  });

  test('a table in a padded body bleeds; a table nested in a cell keeps its inset', () => {
    const { container } = render(
      <Surface title="Usage">
        <Table
          dataSource={[{ key: 'a', name: 'outer' }]}
          columns={[
            {
              dataIndex: 'name',
              key: 'name',
              render: () => <Table columns={columns} dataSource={[{ key: 'n', name: 'nested' }]} />,
              title: 'Name',
            },
          ]}
        />
      </Surface>,
    );
    const [outer, nested] = [
      ...container.querySelectorAll<HTMLElement>('[data-table-wrapper]'),
    ].map((wrapper) => wrapper.parentElement!);
    const rootSelector = bleedRules[0]!;

    expect(outer!.matches(rootSelector)).toBe(true);
    expect(nested!.matches(rootSelector)).toBe(false);
  });
});
