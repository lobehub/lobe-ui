import { fireEvent, render, screen } from '@testing-library/react';

import EventCard from './EventCard';

const props = {
  attendees: 1480,
  date: '2026-11-14',
  description: 'Three short talks.',
  host: 'Bay Area AI Builders',
  tags: ['In person', 'Free'],
  time: '6:30 PM to 9:00 PM',
  title: 'Agentic UI Meetup',
  venue: 'The Foundry',
};

describe('EventCard', () => {
  test('renders the date block, meta lines, tags and footer', () => {
    const { container } = render(<EventCard {...props} />);
    expect(screen.getByText('Nov')).toBeTruthy();
    expect(screen.getByText('14')).toBeTruthy();
    expect(screen.getByText('Sat')).toBeTruthy();
    expect(screen.getByText('6:30 PM to 9:00 PM')).toBeTruthy();
    expect(screen.getByText('Hosted by Bay Area AI Builders')).toBeTruthy();
    expect(screen.getByText('1,480 going')).toBeTruthy();
    expect(container.querySelectorAll('.lobe-event-card__tag')).toHaveLength(2);
    expect(container.querySelector('.lobe-event-card__action')).toBeNull();
  });

  test('shows the RSVP action when onAction is set', () => {
    const onAction = vi.fn();
    render(<EventCard {...props} variant="a2ui" onAction={onAction} />);
    fireEvent.click(screen.getByText('RSVP'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  test('puts an unparsable date on the time line', () => {
    render(<EventCard date="Next Friday" title="Offsite" />);
    expect(screen.getByText('Date')).toBeTruthy();
    expect(screen.getByText('Next Friday')).toBeTruthy();
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(<EventCard {...props} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const defaultClass = root.className;
    rerender(<EventCard {...props} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.className).not.toBe(defaultClass);
  });
});
