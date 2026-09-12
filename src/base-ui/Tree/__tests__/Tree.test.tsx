import { act, fireEvent, render, screen } from '@testing-library/react';

import Tree from '../Tree';
import type { TreeDataNode } from '../type';

const data: TreeDataNode[] = [
  {
    children: [
      { key: 'a-1', title: 'a-1' },
      { key: 'a-2', title: 'a-2' },
    ],
    key: 'a',
    title: 'a',
  },
  { children: [{ key: 'b-1', title: 'b-1' }], key: 'b', title: 'b' },
  { key: 'c', title: 'c' },
];

const item = (name: string) => screen.getByRole('treeitem', { name });

describe('Tree', () => {
  test('renders only expanded subtrees and toggles via switcher', () => {
    const onExpand = vi.fn();
    render(<Tree defaultExpandedKeys={['a']} treeData={data} onExpand={onExpand} />);

    expect(screen.getByText('a-1')).toBeTruthy();
    expect(screen.queryByText('b-1')).toBeNull();
    expect(item('a').getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(item('b').querySelector('button')!);
    expect(onExpand).toHaveBeenCalledWith(['a', 'b'], expect.objectContaining({ expanded: true }));
    expect(screen.getByText('b-1')).toBeTruthy();
  });

  test('controlled expandedKeys does not toggle on its own', () => {
    const onExpand = vi.fn();
    render(<Tree expandedKeys={[]} treeData={data} onExpand={onExpand} />);
    fireEvent.click(item('a').querySelector('button')!);
    expect(onExpand).toHaveBeenCalledWith(['a'], expect.anything());
    expect(screen.queryByText('a-1')).toBeNull();
  });

  test('selects a single node on title click', () => {
    const onSelect = vi.fn();
    render(<Tree treeData={data} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('c'));
    expect(onSelect).toHaveBeenCalledWith(['c'], expect.objectContaining({ selected: true }));
    expect(item('c').getAttribute('aria-selected')).toBe('true');
    fireEvent.click(screen.getByText('a'));
    expect(item('c').getAttribute('aria-selected')).toBe('false');
    expect(item('a').getAttribute('aria-selected')).toBe('true');
  });

  test('multiple: shift click selects a visible range', () => {
    const onSelect = vi.fn();
    render(<Tree multiple defaultExpandedKeys={['a']} treeData={data} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('a-1'));
    fireEvent.click(screen.getByText('b'), { shiftKey: true });
    expect(onSelect).toHaveBeenLastCalledWith(['a-1', 'a-2', 'b'], expect.anything());
  });

  test('checkable: checking a parent links descendants and reports checked keys', () => {
    const onCheck = vi.fn();
    render(<Tree checkable defaultExpandedKeys={['a']} treeData={data} onCheck={onCheck} />);
    fireEvent.click(item('a').querySelector('[role="checkbox"]')!);
    expect(onCheck).toHaveBeenCalledWith(
      expect.arrayContaining(['a', 'a-1', 'a-2']),
      expect.objectContaining({ checked: true }),
    );
    expect(item('a-1').getAttribute('aria-checked')).toBe('true');

    fireEvent.click(item('a-1').querySelector('[role="checkbox"]')!);
    expect(item('a').getAttribute('aria-checked')).toBe('mixed');
  });

  test('keyboard: arrows move focus, right expands, left collapses', () => {
    render(<Tree treeData={data} />);
    const a = item('a');
    act(() => a.focus());
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(a.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(item('a-1'));
    fireEvent.keyDown(item('a-1'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(item('a-2'));
    fireEvent.keyDown(item('a-2'), { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(item('a'));
    fireEvent.keyDown(item('a'), { key: 'ArrowLeft' });
    expect(item('a').getAttribute('aria-expanded')).toBe('false');
    fireEvent.keyDown(item('a'), { key: 'End' });
    expect(document.activeElement).toBe(item('c'));
  });

  test('keyboard: Enter selects, Space checks', () => {
    const onSelect = vi.fn();
    const onCheck = vi.fn();
    render(<Tree checkable treeData={data} onCheck={onCheck} onSelect={onSelect} />);
    const c = item('c');
    act(() => c.focus());
    fireEvent.keyDown(c, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(['c'], expect.anything());
    fireEvent.keyDown(c, { key: ' ' });
    expect(onCheck).toHaveBeenCalledWith(['c'], expect.objectContaining({ checked: true }));
  });

  test('disabled node ignores select but still expands', () => {
    const onSelect = vi.fn();
    const disabledData: TreeDataNode[] = [{ ...data[0], disabled: true }];
    render(<Tree treeData={disabledData} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('a'));
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(item('a').querySelector('button')!);
    expect(screen.getByText('a-1')).toBeTruthy();
  });

  test('onRightClick receives the node', () => {
    const onRightClick = vi.fn();
    render(<Tree treeData={data} onRightClick={onRightClick} />);
    fireEvent.contextMenu(item('c'));
    expect(onRightClick).toHaveBeenCalledWith(
      expect.objectContaining({ node: expect.objectContaining({ key: 'c' }) }),
    );
  });
});
