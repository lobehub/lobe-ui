'use client';

import type { Lang, LiveTokenizer, ThemedToken } from '@pierre/highlights';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

import { getCodeLanguageByInput } from '@/Highlighter/const';
import { type HighlighterEngine, useHighlighterEngine } from '@/Highlighter/engine';
import { getPreStyle } from '@/Highlighter/tokens';

export type StreamingHighlightResult = {
  lines: ThemedToken[][];
  preStyle?: CSSProperties;
};

interface StreamSession {
  engine: HighlighterEngine;
  language: string;
  lines: ThemedToken[][];
  preStyle?: CSSProperties;
  text: string;
  tokenizer: LiveTokenizer;
}

const readLines = (session: StreamSession, from: number) => {
  const { tokenizer } = session;
  const lines = session.lines.slice(0, Math.min(from, tokenizer.lineCount));
  for (let line = lines.length; line < tokenizer.lineCount; line++) {
    lines.push(tokenizer.getLineTokens(line).tokens);
  }
  session.lines = lines;
};

const createSession = (
  engine: HighlighterEngine,
  language: string,
  text: string,
): StreamSession => {
  const tokenizer = new engine.highlights.LiveTokenizer({
    code: text,
    lang: language as Lang,
    theme: engine.theme,
  });
  const { bg, fg } = engine.highlights.codeToTokens('', {
    lang: language as Lang,
    theme: engine.theme,
  });
  const session: StreamSession = {
    engine,
    language,
    lines: [],
    preStyle: getPreStyle({ bg, fg }),
    text,
    tokenizer,
  };
  readLines(session, 0);
  return session;
};

const updateSession = (session: StreamSession, text: string) => {
  if (text === session.text) return false;

  const { tokenizer } = session;
  if (text.startsWith(session.text)) {
    const lastLine = tokenizer.lineCount - 1;
    const end = { character: tokenizer.getLineLength(lastLine), line: lastLine };
    const update = tokenizer.applyEdits([
      { newText: text.slice(session.text.length), range: { end, start: end } },
    ]);
    const firstChanged = update.lineChanges.reduce(
      (min, change) => Math.min(min, change.newStartLine),
      lastLine,
    );
    session.text = text;
    readLines(session, firstChanged);
  } else {
    tokenizer.reset(text);
    session.text = text;
    readLines(session, 0);
  }
  return true;
};

export const useStreamHighlight = (
  text: string,
  {
    language,
    theme: themeId,
    streaming,
  }: { language: string; streaming?: boolean; theme?: string },
): StreamingHighlightResult | undefined => {
  const safeText = text ?? '';
  const lang = (language ?? 'plaintext').toLowerCase();
  const matchedLanguage = useMemo(() => getCodeLanguageByInput(lang), [lang]);
  const engine = useHighlighterEngine(themeId);

  const sessionRef = useRef<StreamSession | null>(null);
  const [result, setResult] = useState<StreamingHighlightResult>();

  useEffect(() => {
    if (!streaming || !engine) {
      sessionRef.current?.tokenizer.dispose();
      sessionRef.current = null;
      setResult(undefined);
      return;
    }

    let session = sessionRef.current;
    let changed: boolean;
    if (!session || session.engine !== engine || session.language !== matchedLanguage) {
      session?.tokenizer.dispose();
      try {
        session = createSession(engine, matchedLanguage, safeText);
      } catch (error) {
        console.error('Streaming highlighter initialization failed:', error);
        sessionRef.current = null;
        setResult(undefined);
        return;
      }
      sessionRef.current = session;
      changed = true;
    } else {
      try {
        changed = updateSession(session, safeText);
      } catch (error) {
        console.error('Streaming highlighting failed:', error);
        return;
      }
    }

    if (changed) setResult({ lines: session.lines, preStyle: session.preStyle });
  }, [engine, matchedLanguage, safeText, streaming]);

  useEffect(
    () => () => {
      sessionRef.current?.tokenizer.dispose();
      sessionRef.current = null;
    },
    [],
  );

  return result;
};
