import { act, renderHook } from '@testing-library/react';

import { useSelectValue } from '../hooks';

describe('useSelectValue', () => {
  test('emits undefined when a single select is cleared', () => {
    const onChange = vi.fn();
    const setExtraOptions = vi.fn();
    const { result } = renderHook(() =>
      useSelectValue({
        defaultValue: undefined,
        extraOptions: [],
        isMultiple: false,
        onChange,
        onSelect: undefined,
        options: [{ label: 'US West', value: 'us-west-2' }],
        setExtraOptions,
        value: 'us-west-2',
      }),
    );

    act(() => result.current.handleValueChange(null));

    expect(onChange).toHaveBeenCalledWith(undefined, undefined);
  });
});
