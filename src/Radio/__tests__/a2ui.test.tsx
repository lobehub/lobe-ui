import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Radio from '../Radio';
import RadioGroup from '../RadioGroup';

describe('RadioGroup variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders the label, options with descriptions, and picks a value', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup
        defaultValue="team"
        label="Plan"
        optionVariant="cards"
        variant="a2ui"
        options={[
          { label: 'Free', value: 'free' },
          { description: 'Up to 30 seats', label: 'Team', value: 'team' },
        ]}
        onChange={onChange}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('a2ui');
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeTruthy();
    expect(screen.getByText('Up to 30 seats')).toBeTruthy();
    const items = container.querySelectorAll<HTMLElement>('.lobe-radio-group__item');
    expect(items).toHaveLength(2);
    expect(items[0].dataset.optionVariant).toBe('cards');
    fireEvent.click(screen.getByText('Free'));
    expect(onChange).toHaveBeenCalledWith('free', expect.anything());
  });

  test('a standalone Radio takes the a2ui variant', () => {
    const { container } = render(
      <Radio value="a" variant="a2ui">
        Alpha
      </Radio>,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('a2ui');
    expect(screen.getByText('Alpha')).toBeTruthy();
  });
});
