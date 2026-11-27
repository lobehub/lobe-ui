import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import ChipSelect from './ChipSelect';

const options = [
  { label: 'Deploys', value: 'deploys' },
  { label: 'Incidents', value: 'incidents' },
  'billing',
];

describe('ChipSelect', () => {
  afterEach(cleanup);

  test('toggles chips, keeps option order and counts the picks', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ChipSelect
        defaultValue={['incidents']}
        label="Notify me about"
        options={options}
        onChange={onChange}
      />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('default');
    expect(screen.getByText('1 selected')).toBeTruthy();
    const deploys = screen.getByRole('button', { name: 'Deploys' });
    expect(deploys.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(deploys);
    expect(onChange).toHaveBeenLastCalledWith(['deploys', 'incidents'], ['incidents']);
    expect(screen.getByText('2 selected')).toBeTruthy();
    expect(deploys.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'billing' }));
    fireEvent.click(deploys);
    expect(onChange).toHaveBeenLastCalledWith(['incidents', 'billing'], expect.anything());
  });

  test('a2ui variant shows a check on picked chips; texts and showCount', () => {
    const { container, rerender } = render(
      <ChipSelect
        defaultValue={['deploys']}
        label="Topics"
        options={options}
        texts={{ selected: '{count} on' }}
        variant="a2ui"
      />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('a2ui');
    expect(container.querySelectorAll('.lobe-chip-select__check')).toHaveLength(1);
    expect(screen.getByText('1 on')).toBeTruthy();
    rerender(
      <ChipSelect
        defaultValue={['deploys']}
        label="Topics"
        options={options}
        showCount={false}
        variant="a2ui"
      />,
    );
    expect(container.querySelector('.lobe-chip-select__count')).toBeNull();
  });
});
