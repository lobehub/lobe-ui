import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import DateRangePicker from '../DateRangePicker';

const openAt = (text: string) =>
  fireEvent.click(screen.getByRole('button', { name: new RegExp(text) }));
const pick = (label: string) => fireEvent.click(screen.getAllByRole('button', { name: label })[0]);

describe('DateRangePicker', () => {
  afterEach(cleanup);

  test('renders two months and both placeholders', () => {
    render(<DateRangePicker />);

    expect(screen.getByText('Start date')).toBeTruthy();
    expect(screen.getByText('End date')).toBeTruthy();

    openAt('Start date');
    expect(screen.getAllByRole('grid')).toHaveLength(2);
  });

  test('emits an ordered pair even when the end is picked first', () => {
    const onChange = vi.fn();
    render(<DateRangePicker defaultValue={[new Date(2026, 9, 1), null]} onChange={onChange} />);

    openAt('Oct 1, 2026');
    pick('October 20, 2026');
    pick('October 8, 2026');

    const [start, end] = onChange.mock.calls.at(-1)![0] as [Date, Date];
    expect(start.getDate()).toBe(8);
    expect(end.getDate()).toBe(20);
  });

  test('clear resets both ends', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker
        defaultValue={[new Date(2026, 8, 22), new Date(2026, 9, 8)]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('Clear'));

    expect(onChange.mock.calls[0][0]).toEqual([null, null]);
  });
});
