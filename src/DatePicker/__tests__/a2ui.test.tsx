import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';

import { MotionProvider } from '@/MotionProvider';

import DatePicker from '../DatePicker';

describe('DatePicker variant="a2ui"', () => {
  afterEach(cleanup);

  test('shows the label, the formatted date and picks a day from the calendar', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <DatePicker
        defaultValue={new Date(2026, 10, 12)}
        label="Launch date"
        placeholder="Pick a date"
        variant="a2ui"
        onChange={onChange}
      />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('a2ui');
    expect(screen.getByText('Launch date')).toBeTruthy();
    const trigger = screen.getByRole('button', { name: 'Launch date' });
    expect(trigger.textContent).toBe('Thu, Nov 12, 2026');
    await act(async () => {
      fireEvent.click(trigger);
    });
    expect(await screen.findByText('November 2026')).toBeTruthy();
    expect(screen.getByLabelText('Thu, Nov 12, 2026').dataset.selected).toBeDefined();
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('December 2026')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Fri, Dec 4, 2026'));
    expect(onChange).toHaveBeenCalledTimes(1);
    const [date, dateString] = onChange.mock.calls[0];
    expect(date).toBeInstanceOf(Date);
    expect(dateString).toBe('2026-12-04');
  });

  test('shows the placeholder without a value; other pickers keep the default look', () => {
    const { container, rerender } = render(<DatePicker placeholder="Pick a date" variant="a2ui" />);
    expect(screen.getByText('Pick a date')).toBeTruthy();
    rerender(
      <MotionProvider motion={motion}>
        <DatePicker picker="month" variant="a2ui" />
      </MotionProvider>,
    );
    expect((container.firstElementChild as HTMLElement).dataset.variant).toBeUndefined();
  });
});
