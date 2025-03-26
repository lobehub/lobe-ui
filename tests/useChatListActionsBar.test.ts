import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useChatListActionsBar } from '../src/hooks/useChatListActionsBar';

describe('useChatListActionsBar', () => {
  it('should return default labels when no text is provided', () => {
    const { result } = renderHook(() => useChatListActionsBar());

    expect(result.current.copy.label).toBe('Copy');
    expect(result.current.del.label).toBe('Delete');
    expect(result.current.edit.label).toBe('Edit');
    expect(result.current.regenerate.label).toBe('Regenerate');
  });

  it('should return custom labels when text is provided', () => {
    const customText = {
      copy: 'Custom Copy',
      delete: 'Custom Delete',
      edit: 'Custom Edit',
      regenerate: 'Custom Regenerate',
    };

    const { result } = renderHook(() => useChatListActionsBar(customText));

    expect(result.current.copy.label).toBe('Custom Copy');
    expect(result.current.del.label).toBe('Custom Delete');
    expect(result.current.edit.label).toBe('Custom Edit');
    expect(result.current.regenerate.label).toBe('Custom Regenerate');
  });

  it('should return correct icons', () => {
    const { result } = renderHook(() => useChatListActionsBar());

    expect(result.current.copy.icon).toBeDefined();
    expect(result.current.del.icon).toBeDefined();
    expect(result.current.edit.icon).toBeDefined();
    expect(result.current.regenerate.icon).toBeDefined();
  });

  it('should return correct keys', () => {
    const { result } = renderHook(() => useChatListActionsBar());

    expect(result.current.copy.key).toBe('copy');
    expect(result.current.del.key).toBe('del');
    expect(result.current.edit.key).toBe('edit');
    expect(result.current.regenerate.key).toBe('regenerate');
  });

  it('should handle partial text overrides', () => {
    const partialText = {
      copy: 'Custom Copy',
      edit: 'Custom Edit',
    };

    const { result } = renderHook(() => useChatListActionsBar(partialText));

    expect(result.current.copy.label).toBe('Custom Copy');
    expect(result.current.del.label).toBe('Delete');
    expect(result.current.edit.label).toBe('Custom Edit');
    expect(result.current.regenerate.label).toBe('Regenerate');
  });

  it('should return divider with correct type', () => {
    const { result } = renderHook(() => useChatListActionsBar());

    expect(result.current.divider.type).toBe('divider');
  });
});
