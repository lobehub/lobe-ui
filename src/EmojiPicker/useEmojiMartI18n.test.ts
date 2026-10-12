import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createEmojiMartI18nLoader } from './useEmojiMartI18n';

describe('useEmojiMartI18n', () => {
  it('returns undefined first, then the loaded strings', async () => {
    const strings = { search: 'Suche' };
    const useI18n = createEmojiMartI18nLoader(async () => strings);
    const { result } = renderHook(() => useI18n('de-DE'));
    expect(result.current).toBeUndefined();
    await waitFor(() => expect(result.current).toBe(strings));
  });

  it('loads each language once across hook instances', async () => {
    const load = vi.fn(async (language: string) => ({ language }));
    const useI18n = createEmojiMartI18nLoader(load);
    const first = renderHook(() => useI18n('zh-CN'));
    const second = renderHook(() => useI18n('zh-TW'));
    await waitFor(() => expect(first.result.current).toEqual({ language: 'zh' }));
    await waitFor(() => expect(second.result.current).toEqual({ language: 'zh' }));
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('reloads when the locale changes', async () => {
    const useI18n = createEmojiMartI18nLoader(async (language: string) => ({ language }));
    const { result, rerender } = renderHook(({ locale }) => useI18n(locale), {
      initialProps: { locale: 'ja-JP' },
    });
    await waitFor(() => expect(result.current).toEqual({ language: 'ja' }));
    rerender({ locale: 'fr-FR' });
    await waitFor(() => expect(result.current).toEqual({ language: 'fr' }));
  });

  it('stays undefined when loading fails', async () => {
    const useI18n = createEmojiMartI18nLoader(async () => {
      throw new Error('missing');
    });
    const { result } = renderHook(() => useI18n('xx-XX'));
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(result.current).toBeUndefined();
  });
});
