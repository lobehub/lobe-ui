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

const tokensToLineTokens = (tokens: ThemedToken[]): ThemedToken[][] => {
  if (!tokens.length) return [[]];

  const lines: ThemedToken[][] = [[]];
  let currentLine = lines[0];

  const startNewLine = () => {
    currentLine = [];
    lines.push(currentLine);
  };

  tokens.forEach((token) => {
    const content = token.content ?? '';

    if (content === '\n') {
      startNewLine();
      return;
    }

    if (!content.includes('\n')) {
      currentLine.push(token);
      return;
    }

    const segments = content.split('\n');
    segments.forEach((segment, index) => {
      if (segment) {
        currentLine.push({
          ...token,
          content: segment,
        });
      }

      if (index < segments.length - 1) {
        startNewLine();
      }
    });
  });

  if (lines.length === 0) return [[]];

  return lines;
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

  const setStreamingResult = useCallback((rawLines: ThemedToken[][]) => {
    const previousLines = linesRef.current;

    const mergedLines = rawLines.map((line, index) => {
      const previousLine = previousLines[index];
      if (
        previousLine &&
        previousLine.length === line.length &&
        previousLine.every((token, tokenIndex) => token === line[tokenIndex])
      ) {
        return previousLine;
      }
      return line;
    });

    linesRef.current = mergedLines;

    setResult({
      colorReplacements: colorReplacementsRef.current,
      lines: mergedLines,
      preStyle: preStyleRef.current,
    });
  }, []);

  const updateTokens = useCallback(
    async (nextText: string, forceReset = false) => {
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
        const mergedTokens = [...tokenizer.tokensStable, ...tokenizer.tokensUnstable];
        setStreamingResult(mergedTokens.length ? tokensToLineTokens(mergedTokens) : [[]]);
        return;
      }

      try {
        await tokenizer.enqueue(chunk);
        const mergedTokens = [...tokenizer.tokensStable, ...tokenizer.tokensUnstable];
        setStreamingResult(tokensToLineTokens(mergedTokens));
      } catch (error) {
        console.error('Streaming highlighting failed:', error);
      }
    },
    [setStreamingResult],
  );

  useEffect(() => {
    if (!enabled) {
      tokenizerRef.current?.clear();
      tokenizerRef.current = null;
      previousTextRef.current = '';
      preStyleRef.current = undefined;
      linesRef.current = [[]];
      setResult(undefined);
      return;
    }

    let cancelled = false;

    (async () => {
      const mod = await shikiModulePromise;
      if (!mod || cancelled) return;

      try {
        const highlighter = await mod.getSingletonHighlighter({
          langs: language ? [language] : [],
          themes: [theme],
        });

        if (!highlighter || cancelled) return;

        const tokenizer = new ShikiStreamTokenizer({
          highlighter,
          lang: language,
          theme,
        });

        tokenizerRef.current = tokenizer;
        previousTextRef.current = '';
        linesRef.current = [[]];

        const themeInfo = highlighter.getTheme(theme);
        preStyleRef.current = createPreStyle(themeInfo?.bg, themeInfo?.fg);

        const currentText = latestTextRef.current;
        if (currentText) {
          await updateTokens(currentText, true);
        } else {
          setStreamingResult([[]]);
        }
      } catch (error) {
        console.error('Streaming highlighter initialization failed:', error);
      }
    })();

    return () => {
      cancelled = true;
      tokenizerRef.current?.clear();
      tokenizerRef.current = null;
      previousTextRef.current = '';
    };
  }, [enabled, language, setStreamingResult, theme, updateTokens]);

  useEffect(() => {
    if (!enabled) return;
    if (!tokenizerRef.current) return;
    updateTokens(safeText);
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

  // Optimize color replacement configuration
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
    [theme],
  );

  const effectiveTheme = builtinTheme || (isDarkMode ? 'slack-dark' : 'slack-ochin');

  return useStreamingHighlighter(safeText, {
    colorReplacements: builtinTheme ? undefined : colorReplacements[effectiveTheme],
    enabled: streaming,
    language: matchedLanguage,
    theme: effectiveTheme,
  });
};
