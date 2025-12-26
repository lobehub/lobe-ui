'use client';

import { useTheme, useThemeMode } from 'antd-style';
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuiltinTheme, ThemedToken } from 'shiki';
import { ShikiStreamTokenizer } from 'shiki-stream';

import { getCodeLanguageByInput } from '@/Highlighter/const';

import { ColorReplacements, StreamingHighlightResult, shikiModulePromise } from './useHighlight';

type StreamingOptions = {
  colorReplacements?: Record<string, string>;
  enabled?: boolean;
  language: string;
  theme: string;
};

// Optimized version: reduce array allocations and object spreading
const tokensToLineTokens = (tokens: ThemedToken[]): ThemedToken[][] => {
  if (!tokens.length) return [[]];

  const lines: ThemedToken[][] = [];
  let currentLine: ThemedToken[] = [];

  for (const token of tokens) {
    const content = token.content ?? '';

    if (content === '\n') {
      lines.push(currentLine);
      currentLine = [];
      continue;
    }

    const newlineIndex = content.indexOf('\n');
    if (newlineIndex === -1) {
      // No newline, add token directly
      currentLine.push(token);
    } else {
      // Split on newlines
      const segments = content.split('\n');
      for (const [j, segment] of segments.entries()) {
        if (segment) {
          // Only create new object if we need to modify content
          currentLine.push(j === 0 && segment === content ? token : { ...token, content: segment });
        }
        if (j < segments.length - 1) {
          lines.push(currentLine);
          currentLine = [];
        }
      }
    }
  }

  // Don't forget the last line
  if (currentLine.length > 0 || lines.length === 0) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [[]];
};

const createPreStyle = (bg?: string, fg?: string): CSSProperties | undefined => {
  if (!bg && !fg) return undefined;
  return {
    backgroundColor: bg,
    color: fg,
  };
};

const useStreamingHighlighter = (
  text: string,
  options: StreamingOptions,
): StreamingHighlightResult | undefined => {
  const { colorReplacements, enabled, language, theme } = options;
  const [result, setResult] = useState<StreamingHighlightResult>();
  const tokenizerRef = useRef<ShikiStreamTokenizer | null>(null);
  const previousTextRef = useRef('');
  const safeText = text ?? '';
  const latestTextRef = useRef(safeText);
  const preStyleRef = useRef<CSSProperties | undefined>(undefined);
  const colorReplacementsRef = useRef(colorReplacements);
  const linesRef = useRef<ThemedToken[][]>([[]]);

  useEffect(() => {
    latestTextRef.current = safeText;
  }, [safeText]);

  useEffect(() => {
    colorReplacementsRef.current = colorReplacements;
  }, [colorReplacements]);

  // Use ref to store callback to avoid recreating it
  const setStreamingResultRef = useRef((rawLines: ThemedToken[][]) => {
    const previousLines = linesRef.current;
    const newLinesLength = rawLines.length;
    const prevLinesLength = previousLines.length;

    // Fast path: if lengths differ or it's a complete reset, use new lines directly
    if (newLinesLength !== prevLinesLength || newLinesLength === 0) {
      linesRef.current = rawLines;
      setResult({
        colorReplacements: colorReplacementsRef.current,
        lines: rawLines,
        preStyle: preStyleRef.current,
      });
      return;
    }

    // Optimized comparison: only check changed lines
    let hasChanges = false;
    const mergedLines: ThemedToken[][] = [];

    for (let i = 0; i < newLinesLength; i++) {
      const newLine = rawLines[i];
      const prevLine = previousLines[i];

      // Quick reference equality check first
      if (prevLine === newLine) {
        mergedLines[i] = prevLine;
        continue;
      }

      // Length check
      if (!prevLine || prevLine.length !== newLine.length) {
        mergedLines[i] = newLine;
        hasChanges = true;
        continue;
      }

      // Deep comparison only for lines that might have changed
      let lineChanged = false;
      for (const [j, newToken] of newLine.entries()) {
        if (prevLine[j] !== newToken) {
          lineChanged = true;
          break;
        }
      }

      if (lineChanged) {
        mergedLines[i] = newLine;
        hasChanges = true;
      } else {
        mergedLines[i] = prevLine;
      }
    }

    // Only update state if there are actual changes
    if (hasChanges) {
      linesRef.current = mergedLines;
      setResult({
        colorReplacements: colorReplacementsRef.current,
        lines: mergedLines,
        preStyle: preStyleRef.current,
      });
    }
  });

  const updateTokens = useCallback(async (nextText: string, forceReset = false) => {
    const tokenizer = tokenizerRef.current;
    if (!tokenizer) return;

    if (forceReset) {
      tokenizer.clear();
      previousTextRef.current = '';
    }

    const previousText = previousTextRef.current;
    let chunk = nextText;
    const canAppend = !forceReset && nextText.startsWith(previousText);

    if (canAppend) {
      chunk = nextText.slice(previousText.length);
    } else if (!forceReset) {
      tokenizer.clear();
    }

    previousTextRef.current = nextText;

    if (!chunk) {
      // Optimize: avoid array spread if possible
      const stableTokens = tokenizer.tokensStable;
      const unstableTokens = tokenizer.tokensUnstable;
      const totalLength = stableTokens.length + unstableTokens.length;

      if (totalLength === 0) {
        setStreamingResultRef.current([[]]);
        return;
      }

      // Only create merged array if we have both stable and unstable tokens
      const mergedTokens =
        stableTokens.length === 0
          ? unstableTokens
          : unstableTokens.length === 0
            ? stableTokens
            : [...stableTokens, ...unstableTokens];

      setStreamingResultRef.current(tokensToLineTokens(mergedTokens));
      return;
    }

    try {
      await tokenizer.enqueue(chunk);
      // Optimize: avoid array spread if possible
      const stableTokens = tokenizer.tokensStable;
      const unstableTokens = tokenizer.tokensUnstable;
      const mergedTokens =
        stableTokens.length === 0
          ? unstableTokens
          : unstableTokens.length === 0
            ? stableTokens
            : [...stableTokens, ...unstableTokens];
      setStreamingResultRef.current(tokensToLineTokens(mergedTokens));
    } catch (error) {
      console.error('Streaming highlighting failed:', error);
    }
  }, []);

  // Cache highlighter key to avoid unnecessary recreations
  const highlighterKeyRef = useRef<string>('');

  useEffect(() => {
    if (!enabled) {
      tokenizerRef.current?.clear();
      tokenizerRef.current = null;
      previousTextRef.current = '';
      preStyleRef.current = undefined;
      linesRef.current = [[]];
      setResult(undefined);
      highlighterKeyRef.current = '';
      return;
    }

    // Skip if language/theme combination hasn't changed
    const currentKey = `${language}-${theme}`;
    if (highlighterKeyRef.current === currentKey && tokenizerRef.current) {
      return;
    }

    let cancelled = false;

    (async () => {
      const mod = await shikiModulePromise;
      if (!mod || cancelled) return;

      try {
        // Only load the specific language and theme needed
        // getSingletonHighlighter will cache the instance internally
        const highlighter = await mod.getSingletonHighlighter({
          langs: language ? [language] : ['plaintext'],
          themes: [theme],
        });

        if (!highlighter || cancelled) return;

        // Only create new tokenizer if key changed
        if (highlighterKeyRef.current !== currentKey) {
          // Clear old tokenizer
          tokenizerRef.current?.clear();

          const tokenizer = new ShikiStreamTokenizer({
            highlighter,
            lang: language,
            theme,
          });

          tokenizerRef.current = tokenizer;
          highlighterKeyRef.current = currentKey;
          previousTextRef.current = '';
          linesRef.current = [[]];

          const themeInfo = highlighter.getTheme(theme);
          preStyleRef.current = createPreStyle(themeInfo?.bg, themeInfo?.fg);
        }

        const currentText = latestTextRef.current;
        if (currentText) {
          await updateTokens(currentText, true);
        } else {
          setStreamingResultRef.current([[]]);
        }
      } catch (error) {
        console.error('Streaming highlighter initialization failed:', error);
        // Reset on error
        highlighterKeyRef.current = '';
      }
    })();

    return () => {
      cancelled = true;
      // Cleanup only if this effect was cancelled before completion
      // The next effect will handle cleanup if key changed
    };
  }, [enabled, language, theme, updateTokens]);

  // Separate effect for text updates to avoid unnecessary tokenizer recreation
  useEffect(() => {
    if (!enabled) return;
    if (!tokenizerRef.current) return;
    // Use ref to get latest text to avoid stale closures
    const currentText = latestTextRef.current;
    updateTokens(currentText);
  }, [enabled, safeText, updateTokens]);

  return result;
};

// Main highlight component
export const useStreamHighlight = (
  text: string,
  {
    language,
    theme: builtinTheme,
    streaming,
  }: { enableTransformer?: boolean; language: string; streaming?: boolean; theme?: BuiltinTheme },
) => {
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();

  // Safely handle language and text with boundary checks
  const safeText = text ?? '';
  const lang = (language ?? 'plaintext').toLowerCase();

  // Match supported languages
  const matchedLanguage = useMemo(() => getCodeLanguageByInput(lang), [lang]);

  // Optimize color replacement configuration - only depend on specific theme properties
  const colorReplacements = useMemo(
    (): ColorReplacements => ({
      'slack-dark': {
        '#4ec9b0': theme.yellow,
        '#569cd6': theme.colorError,
        '#6a9955': theme.gray,
        '#9cdcfe': theme.colorText,
        '#b5cea8': theme.purple10,
        '#c586c0': theme.colorInfo,
        '#ce9178': theme.colorSuccess,
        '#dcdcaa': theme.colorWarning,
        '#e6e6e6': theme.colorText,
      },
      'slack-ochin': {
        '#002339': theme.colorText,
        '#0444ac': theme.geekblue,
        '#0991b6': theme.colorError,
        '#174781': theme.purple10,
        '#2f86d2': theme.colorText,
        '#357b42': theme.gray,
        '#7b30d0': theme.colorInfo,
        '#7eb233': theme.colorWarningTextActive,
        '#a44185': theme.colorSuccess,
        '#dc3eb7': theme.yellow11,
      },
    }),
    [
      theme.yellow,
      theme.colorError,
      theme.gray,
      theme.colorText,
      theme.purple10,
      theme.colorInfo,
      theme.colorSuccess,
      theme.colorWarning,
      theme.geekblue,
      theme.colorWarningTextActive,
      theme.yellow11,
    ],
  );

  const effectiveTheme = builtinTheme || (isDarkMode ? 'slack-dark' : 'slack-ochin');

  return useStreamingHighlighter(safeText, {
    colorReplacements: builtinTheme ? undefined : colorReplacements[effectiveTheme],
    enabled: streaming,
    language: matchedLanguage,
    theme: effectiveTheme,
  });
};
