import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import List from '../List';
import type { ListItem } from '../type';

const items: ListItem[] = [
  { key: 'info', label: 'Assistant info' },
  { key: 'role', label: 'Role' },
  { type: 'divider' },
  { danger: true, key: 'logout', label: 'Log out' },
];

describe('List', () => {
  afterEach(cleanup);

  test('renders rows as buttons and dividers as separators', () => {
    render(<List items={items} />);

    expect(screen.getByRole('list')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByRole('separator')).toBeTruthy();
  });

  test('selectable + uncontrolled: click marks the row current and reports it', () => {
    const onActiveChange = vi.fn();
    render(<List selectable items={items} onActiveChange={onActiveChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));

    expect(screen.getByRole('button', { name: 'Role' }).getAttribute('aria-current')).toBe('true');
    expect(onActiveChange).toHaveBeenCalledWith('role');
  });

  test('not selectable: click does not mark the row current', () => {
    render(<List items={items} />);

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));

    expect(screen.getByRole('button', { name: 'Role' }).getAttribute('aria-current')).toBeNull();
  });

  test('controlled activeKey ignores clicks until the parent updates it', () => {
    render(<List selectable activeKey="info" items={items} />);

    fireEvent.click(screen.getByRole('button', { name: 'Role' }));

    expect(
      screen.getByRole('button', { name: 'Assistant info' }).getAttribute('aria-current'),
    ).toBe('true');
    expect(screen.getByRole('button', { name: 'Role' }).getAttribute('aria-current')).toBeNull();
  });

  test('activeKey={null} renders nothing active', () => {
    const { container } = render(
      <List selectable activeKey={null} defaultActiveKey="info" items={items} />,
    );

    expect(container.querySelector('[aria-current]')).toBeNull();
  });

  test('numeric key 0 can be active', () => {
    render(
      <List
        activeKey={0}
        items={[
          { key: 0, label: 'Zero' },
          { key: 1, label: 'One' },
        ]}
      />,
    );

    expect(screen.getByRole('button', { name: 'Zero' }).getAttribute('aria-current')).toBe('true');
  });

  test('onClick receives key, item and domEvent; item onClick fires first', () => {
    const calls: string[] = [];
    const onClick = vi.fn((_info: unknown) => calls.push('list'));
    render(
      <List
        items={[{ key: 'a', label: 'A', onClick: () => calls.push('item') }]}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    expect(calls).toEqual(['item', 'list']);
    const info = onClick.mock.calls[0][0] as unknown as {
      domEvent: unknown;
      item: { label: string };
      key: string;
    };
    expect(info.key).toBe('a');
    expect(info.item.label).toBe('A');
    expect(info.domEvent).toBeTruthy();
  });

  test('disabled rows fire nothing and are not selected', () => {
    const onClick = vi.fn();
    render(
      <List selectable items={[{ disabled: true, key: 'd', label: 'D' }]} onClick={onClick} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'D' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'D' }).getAttribute('aria-current')).toBeNull();
  });

  test('clicks inside actions do not select the row or fire onClick', () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <List
        selectable
        items={[
          {
            actions: (
              <button type="button" onClick={onRemove}>
                Remove
              </button>
            ),
            key: 'm',
            label: 'Member',
          },
        ]}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole('button', { hidden: true, name: 'Remove' }));

    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Member' }).getAttribute('aria-current')).toBeNull();
  });

  test('href rows render links with aria-current="page" when active', () => {
    render(<List activeKey="docs" items={[{ href: '/docs', key: 'docs', label: 'Docs' }]} />);

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  test('avatar wins over icon; description renders under the label', () => {
    render(
      <List
        items={[
          {
            avatar: <span>AV</span>,
            description: 'Writes long-form',
            icon: () => <svg data-testid="icon" />,
            key: 'w',
            label: 'Writer',
          },
        ]}
      />,
    );

    expect(screen.getByText('AV')).toBeTruthy();
    expect(screen.queryByTestId('icon')).toBeNull();
    expect(screen.getByText('Writes long-form')).toBeTruthy();
  });

  test('sets the displayName', () => {
    expect(List.displayName).toBe('List');
  });
});
