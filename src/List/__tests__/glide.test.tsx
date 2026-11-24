import { cleanup, fireEvent, render } from '@testing-library/react';

import List from '../List';
import type { ListItem } from '../type';

const items: ListItem[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
];

describe('List glide', () => {
  afterEach(cleanup);

  test('renders no glide layer by default and passes handlers through untouched', () => {
    const onMouseOver = vi.fn();
    const { container } = render(<List items={items} onMouseOver={onMouseOver} />);
    const list = container.querySelector('ul')!;

    expect(list.querySelector('.lobe-list__glide')).toBeNull();
    expect(list.hasAttribute('data-glide')).toBe(false);
    expect(list.querySelectorAll(':scope > li')).toHaveLength(2);

    fireEvent.mouseOver(list.querySelector('.lobe-list__item')!);
    expect(onMouseOver).toHaveBeenCalledTimes(1);
  });

  test('glide adds one shared hover layer that follows the hovered row', () => {
    const onMouseOver = vi.fn();
    const { container } = render(<List glide items={items} onMouseOver={onMouseOver} />);
    const list = container.querySelector('ul')!;
    const layer = list.querySelector<HTMLElement>('.lobe-list__glide')!;
    const rows = list.querySelectorAll<HTMLElement>('.lobe-list__item');

    expect(list.hasAttribute('data-glide')).toBe(true);
    expect(layer.getAttribute('role')).toBe('presentation');
    expect(layer.getAttribute('aria-hidden')).toBe('true');

    list.getBoundingClientRect = () => ({ height: 80, left: 0, top: 0, width: 200 }) as DOMRect;
    rows[1].getBoundingClientRect = () => ({ height: 32, left: 0, top: 34, width: 200 }) as DOMRect;

    fireEvent.mouseOver(rows[1]);
    expect(onMouseOver).toHaveBeenCalledTimes(1);
    expect(layer.style.top).toBe('34px');
    expect(layer.style.height).toBe('32px');
  });

  test('a disabled row never takes the glide layer', () => {
    const { container } = render(<List glide items={[{ disabled: true, key: 'a', label: 'A' }]} />);
    const list = container.querySelector('ul')!;
    const layer = list.querySelector<HTMLElement>('.lobe-list__glide')!;
    list.getBoundingClientRect = () => ({ height: 40, left: 0, top: 0, width: 200 }) as DOMRect;

    fireEvent.mouseOver(list.querySelector('.lobe-list__item')!);
    expect(layer.style.height).toBe('0px');
  });
});
