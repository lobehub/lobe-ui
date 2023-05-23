import { Highlight, themes } from 'prism-react-renderer';
import { memo } from 'react';

export interface HighlighterProps {
  children: string;
  language: string;
  isDarkMode: boolean;
}

export const Prism = memo<HighlighterProps>(({ children, language, isDarkMode }) => {
  return (
    <Highlight
      theme={isDarkMode ? themes.vsDark : themes.vsLight}
      code={children}
      language={language as any}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={i} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
});
