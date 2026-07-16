import type { ReactNode } from 'react';

interface HighlightProps {
  query: string;
  text: string;
}

const matchLength = (token: string, terms: string[]): number | undefined => {
  const lowerToken = token.toLowerCase();
  for (const term of terms) {
    const lowerTerm = term.toLowerCase();
    if (!lowerTerm) continue;
    if (lowerToken.startsWith(lowerTerm)) return lowerTerm.length;
    if (lowerTerm.startsWith(lowerToken)) return lowerToken.length;
  }
  return undefined;
};

export const Highlight = ({ query, text }: HighlightProps) => {
  const terms = query.trim().split(/\s+/).filter(Boolean);

  if (terms.length === 0) return <>{text}</>;

  const segments = text.split(/(\s+)/);
  const nodes: ReactNode[] = segments.map((segment, index) => {
    const key = `${index}:${segment}`;
    if (segment === '' || /^\s+$/.test(segment)) return <span key={key}>{segment}</span>;

    const length = matchLength(segment, terms);
    if (length === undefined) return <span key={key}>{segment}</span>;

    return (
      <span key={key}>
        <mark>{segment.slice(0, length)}</mark>
        {segment.slice(length)}
      </span>
    );
  });

  return <>{nodes}</>;
};
