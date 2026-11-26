import { render, screen } from '@testing-library/react';

import Agenda from './Agenda';

describe('Agenda', () => {
  test('renders days with weekday, day number, month and events', () => {
    const { container } = render(
      <Agenda
        locale="en-US"
        title="This week"
        days={[
          {
            date: '2026-10-15',
            events: [
              { location: 'Room 4B', time: '9:30 AM', title: 'Design review', tone: 'positive' },
              { title: 'Offsite' },
            ],
            label: 'Today',
          },
          { date: '2026-10-16', events: [] },
        ]}
      />,
    );
    expect(screen.getByText('This week').tagName).toBe('H3');
    expect(screen.getByText('Today')).toBeTruthy();
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText('Fri')).toBeTruthy();
    expect(screen.getAllByText('Oct')).toHaveLength(2);
    expect(screen.getByText('Room 4B')).toBeTruthy();
    const events = container.querySelectorAll('.lobe-agenda__event');
    expect(events).toHaveLength(2);
    expect((events[0] as HTMLElement).dataset.tone).toBe('positive');
    expect((events[1] as HTMLElement).dataset.tone).toBe('accent');
    expect(screen.getByText('All day')).toBeTruthy();
    expect(screen.getByText('Nothing scheduled')).toBeTruthy();
  });

  test('texts override the built-in strings', () => {
    render(<Agenda days={[{ date: '2026-10-17', events: [] }]} texts={{ empty: 'Free day' }} />);
    expect(screen.getByText('Free day')).toBeTruthy();
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const days = [{ date: '2026-10-15', events: [{ title: 'Review' }] }];
    const { container, rerender } = render(<Agenda days={days} title="Week" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const defaultClass = root.className;

    rerender(<Agenda days={days} title="Week" variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.className).not.toBe(defaultClass);
  });
});
