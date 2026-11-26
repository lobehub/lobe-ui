import { cleanup, render, screen } from '@testing-library/react';

import Steps from '../Steps';

describe('Steps variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders a timeline with statuses, times and descriptions', () => {
    const { container } = render(
      <Steps
        current={1}
        variant="a2ui"
        items={[
          { time: 'Oct 14', title: 'Order confirmed' },
          { description: 'Left the hub', time: 'Oct 15', title: 'In transit' },
          { title: 'Delivered' },
        ]}
      />,
    );

    const list = container.querySelector('ol')!;
    expect(list.dataset.variant).toBe('a2ui');
    expect([...list.querySelectorAll('li')].map((li) => li.dataset.status)).toEqual([
      'finish',
      'process',
      'wait',
    ]);
    expect(screen.getByText('Oct 15')).toBeTruthy();
    expect(screen.getByText('Left the hub')).toBeTruthy();
    // a connector between items, none after the last
    expect(container.querySelectorAll('.lobe-steps__connector')).toHaveLength(2);
  });

  test('every step is finished without status or current', () => {
    const { container } = render(<Steps items={[{ title: 'A' }, { title: 'B' }]} variant="a2ui" />);
    expect([...container.querySelectorAll('li')].map((li) => li.dataset.status)).toEqual([
      'finish',
      'finish',
    ]);
  });
});
