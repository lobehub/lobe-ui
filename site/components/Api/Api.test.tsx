// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import type { ApiComponent } from '../../types/api';
import Api from './Api';

const data: ApiComponent = {
  description: 'Public Button API.',
  name: 'Button',
  properties: [
    {
      defaultValue: 'false',
      deprecated: 'Use `pending` instead.',
      description: 'Shows a loading state.',
      inheritedFrom: 'SharedProps',
      name: 'loading',
      required: false,
      since: '1.2.0',
      source: { column: 3, file: 'src/Button/type.ts', line: 8 },
      type: 'boolean',
    },
  ],
  source: { column: 1, file: 'src/Button/Button.tsx', line: 10 },
};

it('renders serialized API metadata as an accessible, indexable static table', () => {
  const { container } = render(<Api data={data} name="Button" />);
  const table = screen.getByRole('table', { name: 'Button properties' });
  const row = within(table).getByRole('row', { name: /loading/i });

  expect(container.querySelector('[data-pagefind-meta="api"]')).toBeTruthy();
  expect(within(table).getByText('Button properties')).toBeTruthy();
  expect(within(row).getByText('Optional')).toBeTruthy();
  expect(within(row).getByText('false')).toBeTruthy();
  expect(within(row).getByText('Deprecated')).toBeTruthy();
  expect(within(row).getByText('Since 1.2.0')).toBeTruthy();
  expect(within(row).getByText('Inherited from SharedProps')).toBeTruthy();
  expect(table.parentElement?.getAttribute('tabindex')).toBe('0');
});

it('rejects missing compile-time data instead of performing a browser lookup', () => {
  expect(() => render(<Api name="Button" />)).toThrow(/compile-time API metadata.*Button/i);
});
