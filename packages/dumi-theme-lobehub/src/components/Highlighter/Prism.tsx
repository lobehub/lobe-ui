import { useTheme } from 'antd-style';
import { memo } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { languageMap } from './language';

Object.entries(languageMap).forEach(([key, value]) => {
  SyntaxHighlighter.registerLanguage(key, value);
});

export interface PrismSyntaxTheme {
  dark: { [key: string]: React.CSSProperties };
  light: { [key: string]: React.CSSProperties };
}
export interface HighlighterProps {
  children: string;
  language: string;
  theme?: Partial<PrismSyntaxTheme>;
}

const defaultTheme: PrismSyntaxTheme = {
  dark: oneDark,
  light: oneLight,
};

export const Prism = memo<HighlighterProps>(({ children, language, theme }) => {
  const { isDarkMode, lineHeight } = useTheme();

  const Theme = { ...defaultTheme, ...theme };

  return (
    <SyntaxHighlighter
      language={language}
      style={isDarkMode ? Theme.dark : Theme.light}
      customStyle={{ borderRadius: 8, lineHeight: lineHeight }}
    >
      {children}
    </SyntaxHighlighter>
  );
});
