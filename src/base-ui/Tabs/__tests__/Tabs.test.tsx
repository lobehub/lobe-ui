import { render, screen } from '@testing-library/react';

import Tabs from '../Tabs';

describe('Tabs', () => {
  test('selects the first enabled item when no initial key is provided', () => {
    render(
      <Tabs
        orientation="vertical"
        items={[
          { children: 'Unavailable panel', disabled: true, key: 'disabled', label: 'Unavailable' },
          { children: 'Arguments panel', key: 'arguments', label: 'Arguments' },
          { children: 'Response panel', key: 'response', label: 'Response' },
        ]}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Arguments' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(screen.getByRole('tabpanel').textContent).toBe('Arguments panel');
  });
});
