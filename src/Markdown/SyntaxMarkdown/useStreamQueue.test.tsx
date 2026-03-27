import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useStreamQueue } from './useStreamQueue';

describe('useStreamQueue', () => {
  it('accelerates the active block when the preferred char delay drops', () => {
    const blocks = [{ content: 'streaming block', startOffset: 0 }];

    const { result, rerender } = renderHook(
      ({ preferredCharDelay }) => useStreamQueue(blocks, { preferredCharDelay }),
      { initialProps: { preferredCharDelay: 24 } },
    );

    expect(result.current.charDelay).toBe(24);

    rerender({ preferredCharDelay: 8 });
    expect(result.current.charDelay).toBe(8);

    rerender({ preferredCharDelay: 30 });
    expect(result.current.charDelay).toBe(8);
  });
});
