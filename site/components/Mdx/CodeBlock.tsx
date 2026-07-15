import Highlighter from '@lobehub/ui/Highlighter';
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';

import { styles } from './codeBlockStyle';

const FALLBACK_LANG = 'plaintext';

const languageFromClassName = (className?: string): string => {
  if (!className) return FALLBACK_LANG;
  const match = /language-([^\s]+)/.exec(className);
  return match?.[1] || FALLBACK_LANG;
};

const textFromNode = (node: ReactNode): string => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map((item) => textFromNode(item)).join('');
  if (isValidElement(node)) {
    return textFromNode((node.props as { children?: ReactNode }).children);
  }
  return '';
};

const extractCode = (children: ReactNode): { content: string; language: string } => {
  const child = Children.toArray(children).find(isValidElement) as
    ReactElement<{ children?: ReactNode; className?: string }> | undefined;

  if (!child) {
    return { content: textFromNode(children).replace(/\n$/, ''), language: FALLBACK_LANG };
  }

  return {
    content: textFromNode(child.props.children).replace(/\n$/, ''),
    language: languageFromClassName(child.props.className),
  };
};

export default function CodeBlock({ children }: { children?: ReactNode }) {
  const { content, language } = extractCode(children);

  if (!content) return null;

  return (
    <Highlighter className={styles.root} language={language} showLanguage={false} variant="filled">
      {content}
    </Highlighter>
  );
}
