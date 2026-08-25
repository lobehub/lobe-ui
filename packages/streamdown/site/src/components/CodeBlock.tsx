import { renderMermaidSVG, type RenderOptions } from 'beautiful-mermaid';
import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  memo,
  type ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { codeToHtml } from 'shiki';

/**
 * Highlighting and diagram rendering are far more expensive than a reveal commit,
 * so neither runs while the fence is still arriving — the block stays plain text
 * until its source has held still, then upgrades in place.
 */
const useSettled = (value: string, delay = 180) => {
  const [settled, setSettled] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
};

const MERMAID_OPTIONS: RenderOptions = {
  accent: 'var(--fg)',
  bg: 'var(--card)',
  border: 'var(--border-strong)',
  fg: 'var(--fg)',
  line: 'var(--fg-2)',
  muted: 'var(--fg-3)',
  surface: 'var(--bg-subtle)',
  transparent: true,
};

const Mermaid = memo<{ code: string }>(({ code }) => {
  const settled = useSettled(code);
  const svg = useMemo(() => {
    if (!settled) return '';
    try {
      return renderMermaidSVG(settled, MERMAID_OPTIONS);
    } catch {
      return '';
    }
  }, [settled]);

  if (!svg) {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }

  return <div className="mermaid" dangerouslySetInnerHTML={{ __html: svg }} />;
});

const Highlighted = memo<{ code: string; language: string }>(({ code, language }) => {
  const settled = useSettled(code);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (!settled) return;
    let cancelled = false;

    codeToHtml(settled, {
      lang: language,
      themes: { dark: 'github-dark', light: 'github-light' },
    })
      .then((result) => !cancelled && setHtml(result))
      .catch(() => !cancelled && setHtml(''));

    return () => {
      cancelled = true;
    };
  }, [settled, language]);

  if (!html) {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }

  return <div className="highlighted" dangerouslySetInnerHTML={{ __html: html }} />;
});

const toText = (node: unknown): string => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(toText).join('');
  if (isValidElement<{ children?: unknown }>(node)) return toText(node.props.children);
  return '';
};

export const Pre = ({ children, ...rest }: ComponentPropsWithoutRef<'pre'>) => {
  const child = Children.toArray(children).find((node) =>
    isValidElement<{ className?: string }>(node),
  ) as ReactElement<{ className?: string }> | undefined;

  const language = /language-(\w+)/.exec(child?.props.className ?? '')?.[1];
  if (!language) return <pre {...rest}>{children}</pre>;

  const code = toText(child).replace(/\n$/, '');
  if (language === 'mermaid') return <Mermaid code={code} />;

  return <Highlighted code={code} language={language} />;
};

export const markdownComponents = { pre: Pre };
