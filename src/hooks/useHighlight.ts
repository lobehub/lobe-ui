'use client';

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { useTheme, useThemeMode } from 'antd-style';
import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuiltinTheme, CodeToHastOptions, ThemedToken } from 'shiki';
import { ShikiStreamTokenizer } from 'shiki-stream';
import useSWR, { SWRResponse } from 'swr';
import { Md5 } from 'ts-md5';

import { getCodeLanguageByInput } from '@/Highlighter/const';

// Application-level cache to avoid repeated calculations
const MD5_LENGTH_THRESHOLD = 10_000; // Use async MD5 for text exceeding this length

// Color replacement mapping type
type ColorReplacements = {
  [themeName: string]: {
    [color: string]: string;
  };
};

type StreamingHighlightResult = {
  colorReplacements?: Record<string, string>;
  lines: ThemedToken[][];
  preStyle?: CSSProperties;
};

type StreamingOptions = {
  colorReplacements?: Record<string, string>;
  enabled?: boolean;
  language: string;
  theme: string;
};

type UseHighlightResponse = SWRResponse<string, Error> & {
  colorReplacements?: ColorReplacements;
  streaming?: StreamingHighlightResult;
};

type ICodeToHtml = (code: string, options: CodeToHastOptions) => Promise<string>;
type ShikiModule = typeof import('shiki');

// Lazy load shiki
const loadShikiModule = (): Promise<ShikiModule | null> => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  return import('shiki');
};
const shikiModulePromise = loadShikiModule();

const loadShiki = (): Promise<ICodeToHtml | null> => {
  return shikiModulePromise.then((mod) => mod?.codeToHtml ?? null);
};
const shikiPromise = loadShiki();

// Helper function: Safe HTML escaping
const escapeHtml = (str: string): string => {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
  const latestTextRef = useRef(text);
  const preStyleRef = useRef<CSSProperties | undefined>(undefined);
  const colorReplacementsRef = useRef(colorReplacements);
  const linesRef = useRef<ThemedToken[][]>([[]]);

  useEffect(() => {
    latestTextRef.current = text;
  }, [text]);

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
    updateTokens(text);
  }, [enabled, text, updateTokens]);

  return result;
};

// Main highlight component
export const useHighlight = (
  text: string,
  {
    language,
    enableTransformer,
    theme: builtinTheme,
    streaming,
  }: { enableTransformer?: boolean; language: string; streaming?: boolean; theme?: BuiltinTheme },
): UseHighlightResponse => {
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();
  const lang = language.toLowerCase();

  // Match supported languages
  const matchedLanguage = useMemo(() => getCodeLanguageByInput(lang), [lang]);

  // Optimize transformer creation
  const transformers = useMemo(() => {
    if (!enableTransformer) return;
    return [
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
    ];
  }, [enableTransformer]);

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

  // Build cache key
  const cacheKey = useMemo((): string | null => {
    // Use hash for long text
    const hash = text.length < MD5_LENGTH_THRESHOLD ? text : Md5.hashStr(text);
    return [matchedLanguage, builtinTheme || (isDarkMode ? 'd' : 'l'), hash]
      .filter(Boolean)
      .join('-');
  }, [text, matchedLanguage, isDarkMode, builtinTheme]);

  // Use SWR to get highlighted HTML
  const response = useSWR(
    streaming ? null : cacheKey,
    async (): Promise<string> => {
      try {
        // Try full rendering
        const codeToHtml = await shikiPromise;
        if (!codeToHtml) return text;
        const html = await codeToHtml(text, {
          colorReplacements: builtinTheme ? undefined : colorReplacements,
          lang: matchedLanguage,
          theme: builtinTheme || (isDarkMode ? 'slack-dark' : 'slack-ochin'),
          transformers,
        });

        return html;
      } catch (error) {
        console.error('Advanced rendering failed:', error);

        try {
          // Try simple rendering (without transformers)
          const codeToHtml = await shikiPromise;
          if (!codeToHtml) return text;
          const html = await codeToHtml(text, {
            lang: matchedLanguage,
            theme: isDarkMode ? 'dark-plus' : 'light-plus',
          });
          return html;
        } catch {
          // Fallback to plain text
          const fallbackHtml = `<pre class="fallback"><code>${escapeHtml(text)}</code></pre>`;
          return fallbackHtml;
        }
      }
    },
    {
      dedupingInterval: 3000, // Only execute once for the same request within 3 seconds
      errorRetryCount: 2, // Retry at most 2 times
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const effectiveTheme = builtinTheme || (isDarkMode ? 'slack-dark' : 'slack-ochin');
  const streamingResult = useStreamingHighlighter(text, {
    colorReplacements: builtinTheme ? undefined : colorReplacements[effectiveTheme],
    enabled: streaming,
    language: matchedLanguage,
    theme: effectiveTheme,
  });

  return {
    ...response,
    colorReplacements,
    streaming: streamingResult,
  };
};

export { escapeHtml, loadShiki, MD5_LENGTH_THRESHOLD, shikiPromise };
