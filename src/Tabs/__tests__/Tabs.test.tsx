import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Tabs from '../Tabs';

describe('Tabs', () => {
  test('selects the first enabled item when no initial key is provided', () => {
    render(
      <Tabs
        orientation="vertical"
        items={[
          { children: 'Unavailable panel', disabled: true, key: 'disabled', label: 'Unavailable' },
          { children: 'Arguments panel', key: 'arguments', label: 'Arguments' },
          { children: 'Response panel', key: 'response', label: 'Response' },
        ]}
      />,
    );

    expect(screen.getByRole('tab', { name: 'Arguments' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(screen.getByRole('tabpanel').textContent).toBe('Arguments panel');
  });
});

describe('Tabs interaction', () => {
  afterEach(cleanup);

  const items = [
    { children: 'Home panel', key: 'home', label: 'Home' },
    { children: 'Color panel', key: 'color', label: 'Color' },
    { children: 'Locked panel', disabled: true, key: 'locked', label: 'Locked' },
  ];

  const selected = () => screen.getByRole('tab', { selected: true }).textContent;

  test('switches the panel and reports the key on click', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Color' }));

    expect(selected()).toBe('Color');
    expect(screen.getByRole('tabpanel').textContent).toBe('Color panel');
    expect(onChange).toHaveBeenCalledWith('color');
  });

  test('ignores clicks on a disabled tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} onChange={onChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Locked' }));

    expect(selected()).toBe('Home');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('follows a controlled activeKey', () => {
    const { rerender } = render(<Tabs activeKey="home" items={items} />);

    rerender(<Tabs activeKey="color" items={items} />);

    expect(selected()).toBe('Color');
    expect(screen.getByRole('tabpanel').textContent).toBe('Color panel');
  });

  test('renders updated labels and panels when items change', () => {
    const { rerender } = render(<Tabs items={items} />);

    rerender(
      <Tabs
        items={[
          { children: 'Start panel', key: 'home', label: 'Start' },
          ...items.slice(1),
          { children: 'Extra panel', key: 'extra', label: 'Extra' },
        ]}
      />,
    );

    expect(selected()).toBe('Start');
    expect(screen.getByRole('tabpanel').textContent).toBe('Start panel');
    expect(screen.getByRole('tab', { name: 'Extra' })).toBeTruthy();
  });

  test('applies updated classNames to every tab', () => {
    const { rerender } = render(<Tabs classNames={{ tab: 'one' }} items={items} />);

    rerender(<Tabs classNames={{ tab: 'two' }} items={items} />);

    for (const tab of screen.getAllByRole('tab')) expect(tab.className).toContain('two');
  });
});
