import { fireEvent, render, screen } from '@testing-library/react';
import { BookOpen } from 'lucide-react';

import ConsoleNav from './ConsoleNav';

const groups = [
  {
    groups: [
      {
        items: [{ end: true, href: '/docs/button', label: 'Button' }],
        key: 'docs/general',
        label: 'General',
      },
    ],
    href: '/sections/docs',
    icon: BookOpen,
    key: 'docs',
    label: 'Docs',
  },
  {
    items: [{ end: true, href: '/guides/start', label: 'Start' }],
    key: 'guides',
    label: 'Guides',
  },
];
const items = [{ end: true, href: '/', label: 'Home' }];

const header = (name: string) => screen.getByRole('button', { hidden: true, name });

describe('ConsoleNav', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    });
  });

  it('keeps every group open by default', () => {
    render(<ConsoleNav groups={groups} items={items} pathname="/" />);

    expect(header('Docs').getAttribute('aria-expanded')).toBe('true');
    expect(header('Guides').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
  });

  it('opens only the active branch and reopens it on navigation', () => {
    const { rerender } = render(
      <ConsoleNav defaultExpanded="active" groups={groups} items={items} pathname="/docs/button" />,
    );

    expect(header('Docs').getAttribute('aria-expanded')).toBe('true');
    expect(header('General').getAttribute('aria-expanded')).toBe('true');
    expect(header('Guides').getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(header('Docs'));
    expect(header('Docs').getAttribute('aria-expanded')).toBe('false');

    rerender(
      <ConsoleNav
        defaultExpanded="active"
        groups={groups}
        items={items}
        pathname="/guides/start"
      />,
    );
    expect(header('Guides').getAttribute('aria-expanded')).toBe('true');
    expect(header('Docs').getAttribute('aria-expanded')).toBe('false');

    rerender(
      <ConsoleNav defaultExpanded="active" groups={groups} items={items} pathname="/docs/button" />,
    );
    expect(header('Docs').getAttribute('aria-expanded')).toBe('true');
  });

  it('lets a group override the default', () => {
    const nested = [{ ...groups[0], groups: [{ ...groups[0].groups![0], defaultExpanded: true }] }];
    render(<ConsoleNav defaultExpanded="active" groups={nested} pathname="/" />);

    expect(header('Docs').getAttribute('aria-expanded')).toBe('false');
    expect(header('General').getAttribute('aria-expanded')).toBe('true');
  });

  it('reads the legacy list of closed groups', () => {
    window.localStorage.setItem('nav', JSON.stringify(['guides']));
    render(<ConsoleNav groups={groups} pathname="/" storageKey="nav" />);

    expect(header('Guides').getAttribute('aria-expanded')).toBe('false');
    expect(header('Docs').getAttribute('aria-expanded')).toBe('true');
  });

  it('shows only icon groups on the rail, linked to their overview', () => {
    render(<ConsoleNav collapsed groups={groups} items={items} pathname="/docs/button" />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('href')).toBe('/sections/docs');
    expect(links[0].getAttribute('aria-label')).toBe('Docs');
    expect(links[0].getAttribute('data-active')).toBe('true');
  });

  it('routes clicks through onNavigate and leaves external links alone', () => {
    const onNavigate = vi.fn();
    render(
      <ConsoleNav
        groups={[]}
        items={[...items, { external: true, href: 'https://example.com', label: 'Out' }]}
        pathname="/"
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(onNavigate).toHaveBeenCalledWith('/');

    const external = screen.getByRole('link', { name: 'Out' });
    expect(external.getAttribute('target')).toBe('_blank');
  });
});
