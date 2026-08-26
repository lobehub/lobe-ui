import { renderHook } from '@testing-library/react';

import ActionIcon from '@/base-ui/ActionIcon';
import Button from '@/base-ui/Button';

import { useNativeButton } from './useNativeButton';

describe('useNativeButton', () => {
  test('recognizes the base-ui Button as a native button trigger', () => {
    const { result } = renderHook(() => useNativeButton({ children: <Button>Open menu</Button> }));

    expect(result.current.resolvedNativeButton).toBe(true);
  });

  test('recognizes the base-ui ActionIcon as a native button trigger', () => {
    const { result } = renderHook(() => useNativeButton({ children: <ActionIcon /> }));

    expect(result.current.resolvedNativeButton).toBe(true);
  });
});
