import { cleanup, render, screen } from '@testing-library/react';

import Select from '../Select';

const options = [
  { label: 'United States', value: 'us' },
  { label: 'Europe', value: 'eu' },
];

describe('Select variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders the labelled a2ui trigger with the selected value', () => {
    render(<Select defaultValue="eu" label="Region" options={options} variant="a2ui" />);
    const trigger = screen.getByLabelText('Region');
    expect(trigger.dataset.variant).toBe('a2ui');
    expect(screen.getByText('Europe')).toBeTruthy();
  });

  test('label is ignored by the other variants', () => {
    render(<Select label="Region" options={options} variant="outlined" />);
    expect(screen.queryByText('Region')).toBeNull();
  });
});
