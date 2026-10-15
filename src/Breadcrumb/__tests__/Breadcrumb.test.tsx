import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Breadcrumb from '../Breadcrumb';

describe('Breadcrumb', () => {
  afterEach(cleanup);

  test('renders a labelled nav with an ordered list', () => {
    render(<Breadcrumb items={[{ title: 'Home' }, { title: 'Settings' }]} />);

    const nav = screen.getByRole('navigation', { name: 'breadcrumb' });
    expect(nav.querySelector('ol')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  test('marks the last item as the current page', () => {
    render(<Breadcrumb items={[{ title: 'Home' }, { title: 'Settings' }]} />);

    const items = screen.getAllByRole('listitem');
    expect(items[1].getAttribute('aria-current')).toBe('page');
    expect(items[0].getAttribute('aria-current')).toBeNull();
  });

  test('renders one hidden separator between each pair of items', () => {
    const { container } = render(
      <Breadcrumb items={[{ title: 'A' }, { title: 'B' }, { title: 'C' }]} separator="/" />,
    );

    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(2);
    expect(separators[0].textContent).toBe('/');
  });

  test('a single item renders no separator', () => {
    const { container } = render(<Breadcrumb items={[{ title: 'Only' }]} />);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  test('renders href items as links', () => {
    render(<Breadcrumb items={[{ href: '/home', title: 'Home' }, { title: 'Now' }]} />);

    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/home');
  });

  test('renders onClick items as buttons and fires the handler', () => {
    const onClick = vi.fn();
    render(<Breadcrumb items={[{ onClick, title: 'Back' }, { title: 'Now' }]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('renders an empty nav for no items', () => {
    render(<Breadcrumb items={[]} />);

    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeTruthy();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  test('sets the displayName', () => {
    expect(Breadcrumb.displayName).toBe('Breadcrumb');
  });
});
