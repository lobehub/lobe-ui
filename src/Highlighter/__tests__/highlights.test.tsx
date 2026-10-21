import { render, renderHook, waitFor } from '@testing-library/react';

import { useHighlight } from '@/hooks/useHighlight';
import { useStreamHighlight } from '@/hooks/useStreamHighlight';

import { getCodeLanguageByInput, getCodeLanguageDisplayName } from '../const';
import { loadEngine } from '../engine';
import SyntaxHighlighter from '../SyntaxHighlighter';

const lineText = (line: { content: string }[]) => line.map((token) => token.content).join('');

describe('highlights engine', () => {
  beforeAll(async () => {
    await loadEngine();
    await loadEngine('github-dark');
  });

  it('resolves aliases to canonical ids and falls back to plaintext', () => {
    expect(getCodeLanguageByInput('TS')).toBe('typescript');
    expect(getCodeLanguageByInput('sh')).toBe('shellscript');
    expect(getCodeLanguageByInput('mts')).toBe('typescript');
    expect(getCodeLanguageByInput('prisma')).toBe('plaintext');
    expect(getCodeLanguageDisplayName('py')).toBe('Python');
  });

  it('renders one .line span per source line with lobe palette variables', async () => {
    const { result } = renderHook(() =>
      useHighlight("const a = '<b>';\nlet b = 1", { language: 'ts' }),
    );

    await waitFor(() => expect(result.current).not.toBe(''));
    const container = document.createElement('div');
    container.innerHTML = result.current;

    const lines = container.querySelectorAll('pre.shiki code > span.line');
    expect(lines).toHaveLength(2);
    expect(lines[0].textContent).toBe("const a = '<b>';");
    expect(result.current).toContain('var(--lobe-color-success)');
  });

  it('uses bundled theme colors when a theme id is given', async () => {
    const { result } = renderHook(() =>
      useHighlight('const a = 1', { language: 'ts', theme: 'github-dark' }),
    );

    await waitFor(() => expect(result.current).not.toBe(''));
    expect(result.current).toContain('#f97583');
    expect(result.current).not.toContain('--lobe-');
  });

  it('re-highlights with the new theme once it loads instead of caching the old one', async () => {
    const { result, rerender } = renderHook(
      ({ theme }) => useHighlight('let switched = 1', { language: 'ts', theme }),
      { initialProps: { theme: undefined as string | undefined } },
    );

    await waitFor(() => expect(result.current).toContain('--lobe-'));
    rerender({ theme: 'nord' });
    await waitFor(() => expect(result.current).toContain('shiki Nord'));
    expect(result.current).not.toContain('--lobe-');
  });

  it('re-renders SyntaxHighlighter when only the theme prop changes', async () => {
    const { container, rerender } = render(
      <SyntaxHighlighter language="ts">let a = 1</SyntaxHighlighter>,
    );
    await waitFor(() => expect(container.querySelector('pre.lobe-theme')).not.toBeNull());

    rerender(
      <SyntaxHighlighter language="ts" theme="github-dark">
        let a = 1
      </SyntaxHighlighter>,
    );
    await waitFor(() =>
      expect(container.querySelector('pre')?.className).toBe('shiki GitHub Dark'),
    );
  });

  it('streams appended text and keeps unchanged line references', async () => {
    const { result, rerender } = renderHook(
      ({ text }) => useStreamHighlight(text, { language: 'ts', streaming: true }),
      { initialProps: { text: '/* a\n b */ const' } },
    );

    await waitFor(() => expect(result.current?.lines).toHaveLength(2));
    const firstLine = result.current!.lines[0];

    rerender({ text: "/* a\n b */ const x = 'y';\nfunc" });
    await waitFor(() => expect(result.current?.lines).toHaveLength(3));

    const { lines } = result.current!;
    expect(lines[0]).toBe(firstLine);
    expect(lines.map(lineText)).toEqual(['/* a', " b */ const x = 'y';", 'func']);
    expect(lines[1][0].color).toBe('var(--lobe-color-text-quaternary)');

    rerender({ text: 'let z' });
    await waitFor(() => expect(result.current?.lines.map(lineText)).toEqual(['let z']));
  });
});
