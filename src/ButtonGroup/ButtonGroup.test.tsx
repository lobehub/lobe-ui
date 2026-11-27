import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import ButtonGroup from './ButtonGroup';

const options = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  'yearly',
];

describe('ButtonGroup', () => {
  afterEach(cleanup);

  test('is a radio group that picks one value', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ButtonGroup
        defaultValue="yearly"
        label="Billing period"
        options={options}
        onChange={onChange}
      />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('default');
    expect(screen.getByRole('radiogroup', { name: 'Billing period' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'yearly' }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: 'Monthly' }));
    expect(onChange).toHaveBeenCalledWith('monthly');
    fireEvent.click(screen.getByRole('radio', { name: 'Monthly' }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('arrow keys move the pick; a2ui variant', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ButtonGroup defaultValue="monthly" options={options} variant="a2ui" onChange={onChange} />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('a2ui');
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('yearly');
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('monthly');
  });
});
