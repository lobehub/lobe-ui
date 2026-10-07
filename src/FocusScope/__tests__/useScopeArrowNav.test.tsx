import { act, fireEvent, render, screen } from '@testing-library/react';

import { FocusScope } from '../FocusScope';
import { getActiveScopeId, setActiveScope } from '../store';
import { useScopeArrowNav } from '../useScopeArrowNav';

const List = ({
  id,
  items,
  onItemFocus,
  vimKeys,
}: {
  id: string;
  items: string[];
  onItemFocus?: (el: HTMLElement) => void;
  vimKeys?: boolean;
}) => {
  useScopeArrowNav({ onItemFocus, scopeId: id, vimKeys });
  return (
    <FocusScope id={id}>
      {items.map((item) => (
        <div data-scope-item data-id={item} key={item} tabIndex={-1}>
          {item}
        </div>
      ))}
      <input aria-label={`${id}-input`} />
    </FocusScope>
  );
};

afterEach(() => act(() => setActiveScope(null)));

describe('useScopeArrowNav', () => {
  test('ArrowDown moves focus inside the scope that was pointed into, without focus', () => {
    render(<List id="a" items={['a1', 'a2', 'a3']} />);
    fireEvent.pointerDown(screen.getByText('a1'));
    expect(getActiveScopeId()).toBe('a');
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('a1'));
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('a2'));
    fireEvent.keyDown(window, { key: 'End' });
    expect(document.activeElement).toBe(screen.getByText('a3'));
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('a1'));
  });

  test('stays reachable after clicking outside every scope', () => {
    render(
      <>
        <List id="a" items={['a1', 'a2']} />
        <button>outside</button>
      </>,
    );
    fireEvent.pointerDown(screen.getByText('a1'));
    fireEvent.pointerDown(screen.getByText('outside'));
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('a1'));
  });

  test('ignores keys typed into text inputs and already-handled events', () => {
    let block = false;
    const stop = (event: KeyboardEvent) => block && event.preventDefault();
    window.addEventListener('keydown', stop, true);
    render(<List id="a" items={['a1', 'a2']} />);
    fireEvent.pointerDown(screen.getByText('a1'));
    const input = screen.getByLabelText('a-input');
    act(() => input.focus());
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(input);

    act(() => screen.getByText('a1').focus());
    block = true;
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    window.removeEventListener('keydown', stop, true);
    expect(document.activeElement).toBe(screen.getByText('a1'));
  });

  test('j / k only work with vimKeys', () => {
    const { rerender } = render(<List id="a" items={['a1', 'a2']} />);
    fireEvent.pointerDown(screen.getByText('a1'));
    act(() => screen.getByText('a1').focus());
    fireEvent.keyDown(window, { key: 'j' });
    expect(document.activeElement).toBe(screen.getByText('a1'));
    rerender(<List vimKeys id="a" items={['a1', 'a2']} />);
    fireEvent.keyDown(window, { key: 'j' });
    expect(document.activeElement).toBe(screen.getByText('a2'));
  });

  test('only the active scope responds', () => {
    render(
      <>
        <List id="a" items={['a1', 'a2']} />
        <List id="b" items={['b1', 'b2']} />
      </>,
    );
    fireEvent.pointerDown(screen.getByText('b1'));
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('b1'));
  });

  test('double-mounted scope moves focus once and fans out onItemFocus to both', () => {
    const a = vi.fn();
    const b = vi.fn();
    render(
      <>
        <List id="a" items={['a1', 'a2']} onItemFocus={a} />
        <div hidden>
          <List id="a" items={['a1', 'a2']} onItemFocus={b} />
        </div>
      </>,
    );
    fireEvent.pointerDown(screen.getAllByText('a1')[0]);
    act(() => screen.getAllByText('a1')[0].focus());
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getAllByText('a2')[0]);
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  test('Escape inside the scope deactivates it', () => {
    render(<List id="a" items={['a1']} />);
    fireEvent.pointerDown(screen.getByText('a1'));
    fireEvent.keyDown(screen.getByText('a1'), { key: 'Escape' });
    expect(getActiveScopeId()).toBeNull();
  });
});
