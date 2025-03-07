import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useStyles } from '../src/Markdown/style';

describe('useStyles', () => {
  it.skip('should generate default styles', () => {
    const { result } = renderHook(() => useStyles({ fontSize: 14 }));

    const styles = result.current;
    expect(styles).toHaveProperty('root');
  });
});
