import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import Toc from '../Toc';
import type { TocItem } from '../type';

const items: TocItem[] = [
  { href: '#intro', level: 2, title: 'Intro' },
  { href: '#install', level: 2, title: 'Install' },
  { href: '#install-npm', level: 3, title: 'npm' },
  { href: '#usage', level: 2, title: 'Usage' },
];

const tops: Record<string, number> = {};
let scroller: HTMLDivElement;

const rect = (top: number) => ({ top }) as DOMRect;

beforeEach(() => {
  scroller = document.createElement('div');
  scroller.getBoundingClientRect = () => rect(100);
  scroller.scrollTo = vi.fn() as typeof scroller.scrollTo;
  for (const id of ['intro', 'install', 'install-npm', 'usage']) {
    const heading = document.createElement('h2');
    heading.id = id;
    heading.getBoundingClientRect = () => rect(tops[id]);
    scroller.append(heading);
  }
  document.body.append(scroller);
  Object.assign(tops, { 'install': 600, 'install-npm': 800, 'intro': 100, 'usage': 1200 });
});

afterEach(() => {
  cleanup();
  scroller.remove();
});

const current = () => screen.getAllByRole('link').find((link) => link.hasAttribute('aria-current'));

describe('Toc', () => {
  test('renders flat items with SVG path', () => {
    render(<Toc getContainer={() => scroller} items={items} />);

    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '#intro',
      '#install',
      '#install-npm',
      '#usage',
    ]);

    const svg = screen.getByRole('navigation').querySelector('svg');
    expect(svg).toBeTruthy();
    const track = svg?.querySelector('[data-toc-track]');
    expect(track?.getAttribute('d')).toBeTruthy();
  });

  test('active is the last heading above the offset line', async () => {
    const onChange = vi.fn();
    render(<Toc getContainer={() => scroller} items={items} offset={16} onChange={onChange} />);

    expect(current()?.textContent).toBe('Intro');

    Object.assign(tops, { 'install': 110, 'install-npm': 310, 'intro': -400, 'usage': 710 });
    fireEvent.scroll(scroller);
    await waitFor(() => expect(current()?.textContent).toBe('Install'));

    Object.assign(tops, { 'install': -200, 'install-npm': 0, 'intro': -700, 'usage': 400 });
    fireEvent.scroll(scroller);
    await waitFor(() => expect(current()?.textContent).toBe('npm'));
    expect(onChange).toHaveBeenLastCalledWith('install-npm');
  });

  test('click scrolls the container to the target minus offset', () => {
    const onClick = vi.fn();
    scroller.scrollTop = 50;
    render(<Toc getContainer={() => scroller} items={items} offset={16} onClick={onClick} />);

    fireEvent.click(screen.getByRole('link', { name: 'Usage' }));

    expect(onClick).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ href: '#usage', title: 'Usage' }),
    );
    expect(scroller.scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 1200 - 100 + 50 - 16,
    });
    expect(current()?.textContent).toBe('Usage');
  });

  test('clicked item stays active until the scroll settles', async () => {
    render(<Toc getContainer={() => scroller} items={items} />);

    fireEvent.click(screen.getByRole('link', { name: 'Usage' }));
    fireEvent.scroll(scroller);
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    expect(current()?.textContent).toBe('Usage');

    act(() => {
      scroller.dispatchEvent(new Event('scrollend'));
    });
    fireEvent.scroll(scroller);
    await waitFor(() => expect(current()?.textContent).toBe('Intro'));
  });

  test('onClick can prevent the built-in scroll', () => {
    render(
      <Toc
        getContainer={() => scroller}
        items={items}
        onClick={(event) => event.preventDefault()}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Install' }));

    expect(scroller.scrollTo).not.toHaveBeenCalled();
  });

  test('controlled activeKey wins over scroll position', () => {
    render(<Toc activeKey="usage" getContainer={() => scroller} items={items} />);

    expect(current()?.textContent).toBe('Usage');
  });

  test('nested h3 marks its parent h2 as active', () => {
    render(<Toc activeKey="install-npm" getContainer={() => scroller} items={items} />);

    const installLink = screen.getByRole('link', { name: 'Install' });
    const npmLink = screen.getByRole('link', { name: 'npm' });

    expect(npmLink.getAttribute('aria-current')).toBe('location');
    expect(installLink.hasAttribute('data-toc-parent')).toBe(true);
  });

  test('returns null when items is empty', () => {
    const { container } = render(<Toc items={[]} />);

    expect(container.firstChild).toBeNull();
  });
});
