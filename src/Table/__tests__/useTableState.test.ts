import { act, renderHook } from '@testing-library/react';

import { useTableState } from '../useTableState';

describe('useTableState pagination callbacks', () => {
  test('a page-size change fires each callback once', () => {
    const onChange = vi.fn();
    const pageChange = vi.fn();
    const sizeChange = vi.fn();
    const { result } = renderHook(() =>
      useTableState({
        columns: [{ dataIndex: 'id', title: 'Id' }],
        onChange,
        pagination: { defaultCurrent: 2, onChange: pageChange, onShowSizeChange: sizeChange },
      }),
    );

    act(() => result.current.onPaginationChange({ pageIndex: 0, pageSize: 20 }));

    expect(pageChange).toHaveBeenCalledTimes(1);
    expect(pageChange).toHaveBeenCalledWith(1, 20);
    expect(sizeChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
