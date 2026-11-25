import { cleanup, fireEvent, render } from '@testing-library/react';

import GlideHighlight from './GlideHighlight';

const rect = (top: number, height = 30): DOMRect =>
  ({
    bottom: top + height,
    height,
    left: 10,
    right: 210,
    top,
    width: 200,
    x: 10,
    y: top,
  }) as DOMRect;

const setup = () => {
  const utils = render(
    <GlideHighlight data-testid="root">
      <button data-glide-row type="button">
        One
      </button>
      <button data-glide-row type="button">
        Two
      </button>
      <button data-glide-row disabled type="button">
        Off
      </button>
      <span>Not a row</span>
    </GlideHighlight>,
  );
  const root = utils.getByTestId('root');
  const highlight = root.querySelector<HTMLElement>('.lobe-glide-highlight__highlight')!;
  const [one, two] = Array.from(root.querySelectorAll<HTMLElement>('[data-glide-row]'));
  root.getBoundingClientRect = () => rect(100, 200);
  one.getBoundingClientRect = () => rect(100);
  two.getBoundingClientRect = () => rect(132);
  return { ...utils, highlight, one, root, two };
};

describe('GlideHighlight', () => {
  afterEach(cleanup);

  test('stays hidden until a row is hovered', () => {
    const { highlight, root } = setup();
    expect(highlight.getAttribute('aria-hidden')).toBe('true');
    expect(root.hasAttribute('data-visible')).toBe(false);
  });

  test('lands on the hovered row without gliding, then glides to the next one', () => {
    const { highlight, one, root, two } = setup();

    fireEvent.mouseOver(one);
    expect(root.hasAttribute('data-visible')).toBe(true);
    expect(root.hasAttribute('data-gliding')).toBe(false);
    expect(highlight.style.top).toBe('0px');
    expect(highlight.style.height).toBe('30px');
    expect(highlight.style.width).toBe('200px');

    fireEvent.mouseOver(two);
    expect(root.hasAttribute('data-gliding')).toBe(true);
    expect(highlight.style.top).toBe('32px');
  });

  test('hides on mouse leave and fades in fresh on re-entry', () => {
    const { one, root, two } = setup();
    fireEvent.mouseOver(one);
    fireEvent.mouseLeave(root);
    expect(root.hasAttribute('data-visible')).toBe(false);

    fireEvent.mouseOver(two);
    expect(root.hasAttribute('data-visible')).toBe(true);
    expect(root.hasAttribute('data-gliding')).toBe(false);
  });

  test('ignores disabled rows and elements that are not rows', () => {
    const { getByText, root } = setup();
    fireEvent.mouseOver(getByText('Not a row'));
    expect(root.hasAttribute('data-visible')).toBe(false);
    fireEvent.mouseOver(getByText('Off'));
    expect(root.hasAttribute('data-visible')).toBe(false);
  });

  test('does nothing when disabled', () => {
    const { container } = render(
      <GlideHighlight disabled>
        <button data-glide-row type="button">
          One
        </button>
      </GlideHighlight>,
    );
    fireEvent.mouseOver(container.querySelector('[data-glide-row]')!);
    expect(container.firstElementChild!.hasAttribute('data-visible')).toBe(false);
  });

  test('keeps the caller handlers', () => {
    const onMouseOver = vi.fn();
    const { container } = render(
      <GlideHighlight onMouseOver={onMouseOver}>
        <button data-glide-row type="button">
          One
        </button>
      </GlideHighlight>,
    );
    fireEvent.mouseOver(container.querySelector('[data-glide-row]')!);
    expect(onMouseOver).toHaveBeenCalledTimes(1);
    expect(container.firstElementChild!.hasAttribute('data-visible')).toBe(true);
  });
});
