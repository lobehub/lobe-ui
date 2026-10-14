import { act, render } from '@testing-library/react';
import type { Key } from 'react';
import { describe, expect, it } from 'vitest';

import { createTableStore } from './createTableStore';
import { TableStoreProvider, useCellHovered, useRowExpanded, useRowSelected } from './hooks';

describe('createTableStore', () => {
  it('notifies subscribers only when state changes', () => {
    const store = createTableStore();
    let calls = 0;
    store.subscribe(() => {
      calls += 1;
    });
    const selectedKeys = new Set<Key>(['a']);
    store.setState({ selectedKeys });
    store.setState({ selectedKeys });
    expect(calls).toBe(1);
    expect(store.getState().selectedKeys).toBe(selectedKeys);
  });
});

describe('store hooks', () => {
  const renders: Record<string, number> = {};
  const Probe = ({ id }: { id: Key }) => {
    renders[String(id)] = (renders[String(id)] ?? 0) + 1;
    const selected = useRowSelected(id);
    const expanded = useRowExpanded(id);
    return <span data-testid={String(id)}>{`${selected}-${expanded}`}</span>;
  };

  it('re-renders only the rows whose selection flips', () => {
    const store = createTableStore();
    const { getByTestId } = render(
      <TableStoreProvider value={store}>
        <Probe id="a" />
        <Probe id="b" />
      </TableStoreProvider>,
    );
    const before = { ...renders };
    act(() => store.setState({ selectedKeys: new Set<Key>(['a']) }));
    expect(getByTestId('a').textContent).toBe('true-false');
    expect(renders.a - before.a).toBe(1);
    expect(renders.b - before.b).toBe(0);
  });

  it('tracks hover over a row span', () => {
    const store = createTableStore();
    const Cell = ({ index, rowSpan }: { index: number; rowSpan: number }) => (
      <span data-testid={`c${index}`}>{String(useCellHovered(index, rowSpan))}</span>
    );
    const { getByTestId } = render(
      <TableStoreProvider value={store}>
        <Cell index={0} rowSpan={2} />
        <Cell index={3} rowSpan={1} />
      </TableStoreProvider>,
    );
    act(() => store.setState({ hover: [1, 1] }));
    expect(getByTestId('c0').textContent).toBe('true');
    expect(getByTestId('c3').textContent).toBe('false');
  });
});
