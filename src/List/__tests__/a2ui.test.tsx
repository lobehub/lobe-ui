import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';

import List from '../List';

describe('List variant="a2ui"', () => {
  afterEach(cleanup);

  test('renders string items as a numbered list from start', () => {
    const { container } = render(
      <List items={['Connect', 'Pick', 'Deploy']} marker="number" start={3} variant="a2ui" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('OL');
    expect(root.getAttribute('start')).toBe('3');
    expect(root.dataset.variant).toBe('a2ui');
    expect(root.dataset.marker).toBe('number');
    expect(container.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByText('Deploy')).toBeTruthy();
    expect(container.querySelector('button')).toBeNull();
  });

  test('renders icon, value, description, marker and children', () => {
    const { container } = render(
      <List
        connector="solid"
        marker="none"
        variant="a2ui"
        items={[
          { description: '6 left', icon: Users, key: 'seats', label: 'Seats', value: '24 of 30' },
          { children: <b>Badge</b>, disabled: true, key: 'step', label: 'Step', marker: '2' },
        ]}
      />,
    );
    expect(container.firstElementChild?.tagName).toBe('UL');
    expect(screen.getByText('24 of 30').className).toContain('lobe-list__value');
    expect(screen.getByText('6 left').className).toContain('lobe-list__description');
    expect(screen.getByText('2').className).toContain('lobe-list__marker');
    expect(container.querySelector('.lobe-list__marker svg')).toBeTruthy();
    expect(screen.getByText('Badge')).toBeTruthy();
    const rows = container.querySelectorAll('li');
    expect(rows[1].getAttribute('aria-disabled')).toBe('true');
  });

  test('pickable rows are buttons, hide the value and report the item', () => {
    const onClick = vi.fn();
    const { container } = render(
      <List
        items={[{ key: 'team', label: 'Team', value: 'team' }]}
        variant="a2ui"
        onClick={onClick}
      />,
    );
    expect(screen.queryByText('team')).toBeNull();
    fireEvent.click(container.querySelector('button')!);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0].key).toBe('team');
  });

  test('horizontal direction and the default variant stay as before', () => {
    const { container, rerender } = render(
      <List direction="horizontal" items={['Docs', 'Status']} variant="a2ui" />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.direction).toBe('horizontal');
    rerender(<List items={[{ key: 'a', label: 'A', value: '1' }, 'B']} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('borderless');
    expect(container.querySelectorAll('button')).toHaveLength(2);
    expect(screen.getByText('1').className).toContain('lobe-list__extra');
    expect(screen.getByText('B')).toBeTruthy();
  });
});
