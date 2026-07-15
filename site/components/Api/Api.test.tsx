// @vitest-environment jsdom

import { render, screen, within } from '@testing-library/react';

import type { ApiComponent } from '../../types/api';
import { Api } from './Api';

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
    {
      description: 'Identifies the element.',
      inheritedFrom: 'HTMLAttributes',
      name: 'about',
      required: false,
      source: { column: 3, file: 'node_modules/@types/react/index.d.ts', line: 120 },
      type: 'string',
    },
    {
      name: 'variant',
      required: true,
      source: { column: 3, file: 'src/Button/type.ts', line: 12 },
      type: "'filled' | 'outlined'",
    },
    {
      inheritedFrom: 'BaseButtonProps',
      name: '_skipSemantic',
      required: false,
      source: { column: 3, file: 'node_modules/.pnpm/antd@6.5.0/button.d.ts', line: 20 },
      type: 'boolean',
    },
    {
      defaultValue: 'false',
      inheritedFrom: 'BaseButtonProps',
      name: 'danger',
      required: false,
      source: { column: 3, file: 'node_modules/.pnpm/antd@6.5.0/button.d.ts', line: 30 },
      type: 'boolean',
    },
  ],
  source: { column: 1, file: 'src/Button/Button.tsx', line: 10 },
};

it('renders documented properties as a definition list', () => {
  const { container } = render(<Api data={data} name="Button" />);
  const card = screen.getByRole('group', { name: 'Button properties' });

  expect(container.querySelector('[data-pagefind-meta="api"]')).toBeTruthy();
  expect(within(card).getByText('Button properties')).toBeTruthy();

  const loadingTerm = within(card).getByText('loading').closest('dt');
  expect(loadingTerm).toBeTruthy();
  expect(within(loadingTerm as HTMLElement).getByText('Deprecated')).toBeTruthy();
  expect(within(loadingTerm as HTMLElement).getByText('Since 1.2.0')).toBeTruthy();
  expect(within(loadingTerm as HTMLElement).getByText('SharedProps')).toBeTruthy();

  const loadingDefinition = loadingTerm?.nextElementSibling as HTMLElement;
  expect(within(loadingDefinition).getByText('Use `pending` instead.')).toBeTruthy();
  expect(within(loadingDefinition).getByText('Shows a loading state.')).toBeTruthy();
  expect(within(loadingDefinition).getByText(/Defaults to/)).toBeTruthy();

  const variantTerm = within(card).getByText('variant').closest('dt');
  expect(within(variantTerm as HTMLElement).getByText('Required')).toBeTruthy();
  expect(within(card).queryByText('Optional')).toBeNull();
});

it('hides native and internal props behind a footnote', () => {
  render(<Api data={data} name="Button" />);
  const card = screen.getByRole('group', { name: 'Button properties' });

  expect(within(card).queryByText('about')).toBeNull();
  expect(within(card).queryByText('_skipSemantic')).toBeNull();
  expect(within(card).getByText('Also accepts all native HTML and ARIA attributes.')).toBeTruthy();

  const dangerTerm = within(card).getByText('danger').closest('dt');
  expect(within(dangerTerm as HTMLElement).getByText('BaseButtonProps')).toBeTruthy();
});

it('rejects missing compile-time data instead of performing a browser lookup', () => {
  expect(() => render(<Api name="Button" />)).toThrow(/compile-time API metadata.*Button/i);
});
