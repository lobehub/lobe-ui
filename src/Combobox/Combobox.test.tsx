import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

import Combobox from './Combobox';

const options = [
  { label: 'Pacific Time, Los Angeles', value: 'America/Los_Angeles' },
  { label: 'London', value: 'Europe/London' },
  { keywords: 'india', label: 'Kolkata', value: 'Asia/Kolkata' },
];

const openList = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole('combobox'));
  });
};

describe('Combobox', () => {
  afterEach(cleanup);

  test('shows the picked label, filters by search and picks with the keyboard', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Combobox
        defaultValue="Europe/London"
        label="Timezone"
        options={options}
        onChange={onChange}
      />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('default');
    expect(screen.getByRole('combobox').textContent).toBe('London');
    await openList();
    const search = await screen.findByPlaceholderText('Search');
    expect(screen.getAllByRole('option', { hidden: true })).toHaveLength(3);
    fireEvent.change(search, { target: { value: 'india' } });
    const shown = screen.getAllByRole('option', { hidden: true });
    expect(shown).toHaveLength(1);
    fireEvent.keyDown(search, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(
      'Asia/Kolkata',
      expect.objectContaining({ label: 'Kolkata' }),
    );
    expect(screen.getByRole('combobox').textContent).toBe('Kolkata');
  });

  test('a2ui variant: placeholder, empty text and a check on the picked option', async () => {
    const { container } = render(
      <Combobox
        defaultValue="Europe/London"
        options={options}
        texts={{ empty: 'Nothing here' }}
        variant="a2ui"
      />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('a2ui');
    await openList();
    const checked = document.querySelector('.lobe-combobox__item[data-checked]');
    expect(checked?.textContent).toBe('London');
    fireEvent.change(await screen.findByPlaceholderText('Search'), { target: { value: 'zzz' } });
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  test('without a value shows the placeholder', () => {
    render(<Combobox options={options} placeholder="Search timezones" />);
    expect(screen.getByRole('combobox').textContent).toBe('Search timezones');
  });
});
