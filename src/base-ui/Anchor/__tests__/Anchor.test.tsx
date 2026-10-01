import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import Anchor from '../Anchor';
import type { AnchorItem } from '../type';

const items: AnchorItem[] = [
  { href: '#intro', key: 'intro', title: 'Intro' },
  {
    children: [{ href: '#install-npm', key: 'install-npm', title: 'npm' }],
    href: '#install',
    key: 'install',
    title: 'Install',
  },
  { href: '#usage', key: 'usage', title: 'Usage' },
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

describe('Anchor', () => {
  test('renders nested links', () => {
    render(<Anchor getContainer={() => scroller} items={items} />);

    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '#intro',
      '#install',
      '#install-npm',
      '#usage',
    ]);
    expect(screen.getAllByRole('list')).toHaveLength(2);
  });

  test('active is the last heading above the offset line', async () => {
    const onChange = vi.fn();
    render(<Anchor getContainer={() => scroller} items={items} offset={16} onChange={onChange} />);

    expect(current()?.textContent).toBe('Intro');

    Object.assign(tops, { 'install': 110, 'install-npm': 310, 'intro': -400, 'usage': 710 });
    fireEvent.scroll(scroller);
    await waitFor(() => expect(current()?.textContent).toBe('Install'));

    Object.assign(tops, { 'install': -200, 'install-npm': 0, 'intro': -700, 'usage': 400 });
    fireEvent.scroll(scroller);
    await waitFor(() => expect(current()?.textContent).toBe('npm'));
    expect(onChange).toHaveBeenLastCalledWith('install-npm', 'install');
  });

  test('nothing is active before the first heading', () => {
    tops.intro = 500;
    render(<Anchor getContainer={() => scroller} items={items} />);

    expect(current()).toBeUndefined();
  });

  test('click scrolls the container to the target minus offset', () => {
    const onClick = vi.fn();
    scroller.scrollTop = 50;
    render(<Anchor getContainer={() => scroller} items={items} offset={16} onClick={onClick} />);

    fireEvent.click(screen.getByRole('link', { name: 'Usage' }));

    expect(onClick).toHaveBeenCalledWith(expect.anything(), items[2]);
    expect(scroller.scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 1200 - 100 + 50 - 16,
    });
    expect(current()?.textContent).toBe('Usage');
  });

  test('clicked item stays active until the scroll settles', async () => {
    render(<Anchor getContainer={() => scroller} items={items} />);

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
      <Anchor
        getContainer={() => scroller}
        items={items}
        onClick={(event) => event.preventDefault()}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Install' }));

    expect(scroller.scrollTo).not.toHaveBeenCalled();
  });

  test('controlled activeKey wins over scroll position', () => {
    render(<Anchor activeKey="usage" getContainer={() => scroller} items={items} />);

    expect(current()?.textContent).toBe('Usage');
  });
});
