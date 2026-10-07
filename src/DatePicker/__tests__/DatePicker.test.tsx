import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';

import DatePicker from '../DatePicker';

const open = () =>
  fireEvent.click(screen.getByRole('button', { name: /Oct 15, 2026|Select date/ }));

describe('DatePicker', () => {
  afterEach(cleanup);

  test('shows the placeholder, then the formatted value', () => {
    const { rerender } = render(<DatePicker />);
    expect(screen.getByText('Select date')).toBeTruthy();

    rerender(<DatePicker value={new Date(2026, 9, 15, 9, 30)} />);
    expect(screen.getByText('Oct 15, 2026')).toBeTruthy();
  });

  test('picking a day emits a Date and closes', async () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} onChange={onChange} />);

    open();
    fireEvent.click(screen.getByRole('button', { name: 'October 21, 2026' }));

    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getFullYear()).toBe(2026);
    expect(picked.getMonth()).toBe(9);
    expect(picked.getDate()).toBe(21);
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
  });

  test('days before min are disabled even when min has a time', () => {
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} min={new Date(2026, 9, 8, 15, 42)} />);

    open();

    expect(
      (screen.getByRole('button', { name: 'October 7, 2026' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'October 8, 2026' }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  test('mode="month" opens on month tiles and emits the first of the month', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 9, 1)} mode="month" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'October 2026' }));
    fireEvent.click(screen.getByRole('button', { name: 'Nov' }));

    const picked = onChange.mock.calls[0][0] as Date;
    expect(picked.getMonth()).toBe(10);
    expect(picked.getDate()).toBe(1);
  });

  test('arrow keys move focus between days', () => {
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} />);

    open();
    const start = screen.getByRole('button', { name: 'October 15, 2026' });
    start.focus();
    fireEvent.keyDown(start, { key: 'ArrowRight' });

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'October 16, 2026' }));
  });

  test('footer renders under the grid', () => {
    render(
      <DatePicker
        defaultValue={new Date(2026, 9, 15)}
        footer={<button type="button">Never expires</button>}
      />,
    );

    open();

    expect(screen.getByRole('button', { name: 'Never expires' })).toBeTruthy();
  });

  test('clear emits null', () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Clear'));

    expect(onChange.mock.calls[0][0]).toBeNull();
    expect(screen.getByText('Select date')).toBeTruthy();
  });

  test('opening moves focus to the selected day', async () => {
    render(<DatePicker defaultValue={new Date(2026, 9, 15)} />);

    open();

    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('October 15, 2026'),
    );
  });

  test('PageDown and crossing a month edge keep keyboard focus in the grid', async () => {
    render(<DatePicker defaultValue={new Date(2026, 9, 31)} />);

    fireEvent.click(screen.getByRole('button', { name: /Oct 31, 2026/ }));
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('October 31, 2026'),
    );

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('November 1, 2026'),
    );

    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('December 1, 2026'),
    );
  });

  test('opens on an enabled day when today is outside min', async () => {
    const min = dayjs().add(40, 'day').toDate();
    render(<DatePicker min={min} />);

    fireEvent.click(screen.getByRole('button', { name: /Select date/ }));

    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe(
        dayjs(min).format('MMMM D, YYYY'),
      ),
    );
    expect((document.activeElement as HTMLButtonElement).disabled).toBe(false);
  });

  test('arrow keys skip disabled days', async () => {
    render(
      <DatePicker defaultValue={new Date(2026, 9, 15)} disabledDate={(d) => d.getDate() === 16} />,
    );

    open();
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('October 15, 2026'),
    );
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });

    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('October 17, 2026'),
    );
  });
});
