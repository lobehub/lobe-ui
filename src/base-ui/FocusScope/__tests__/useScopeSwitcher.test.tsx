import { act, fireEvent, render, screen } from '@testing-library/react';

import { FocusScope } from '../FocusScope';
import { getActiveScopeId, setActiveScope } from '../store';
import { useScopeArrowNav } from '../useScopeArrowNav';
import { useScopeSwitcher } from '../useScopeSwitcher';

const List = ({ id, items }: { id: string; items: string[] }) => {
  useScopeArrowNav({ scopeId: id });
  return (
    <FocusScope id={id}>
      {items.map((item) => (
        <div data-scope-item data-id={item} key={item} tabIndex={-1}>
          {item}
        </div>
      ))}
    </FocusScope>
  );
};

const Shell = ({ vimKeys }: { vimKeys?: boolean }) => {
  useScopeSwitcher({ vimKeys });
  return (
    <>
      <List id="a" items={['a1', 'a2']} />
      <List id="b" items={['b1', 'b2']} />
    </>
  );
};

vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
  bottom: 10,
  height: 10,
  left: 0,
  right: 10,
  toJSON: () => ({}),
  top: 0,
  width: 10,
  x: 0,
  y: 0,
});

afterEach(() => act(() => setActiveScope(null)));

describe('useScopeSwitcher', () => {
  test('ArrowRight activates the next scope and focuses its first item; no wrap', () => {
    render(<Shell />);
    fireEvent.pointerDown(screen.getByText('a1'));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(getActiveScopeId()).toBe('b');
    expect(document.activeElement).toBe(screen.getByText('b1'));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(getActiveScopeId()).toBe('b');
  });

  test('switching back restores the last focused item', () => {
    render(<Shell />);
    fireEvent.pointerDown(screen.getByText('a1'));
    act(() => screen.getByText('a1').focus());
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByText('a2'));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(screen.getByText('a2'));
  });

  test('a prevented ArrowRight does not switch', () => {
    render(<Shell />);
    fireEvent.pointerDown(screen.getByText('a1'));
    const stop = (event: KeyboardEvent) => event.preventDefault();
    window.addEventListener('keydown', stop, true);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    window.removeEventListener('keydown', stop, true);
    expect(getActiveScopeId()).toBe('a');
  });

  test('h / l only with vimKeys', () => {
    render(<Shell vimKeys />);
    fireEvent.pointerDown(screen.getByText('a1'));
    fireEvent.keyDown(window, { key: 'l' });
    expect(getActiveScopeId()).toBe('b');
    fireEvent.keyDown(window, { key: 'h' });
    expect(getActiveScopeId()).toBe('a');
  });
});
