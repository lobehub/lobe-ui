import { Highlight, themes } from 'prism-react-renderer';
import { memo } from 'react';

export interface PrismProps {
  children: string;
  isDarkMode: boolean;
  language: string;
}

export const Prism = memo<PrismProps>(({ children, language, isDarkMode }) => {
  return (
    <Highlight
      code={children}
      language={language as any}
      theme={isDarkMode ? themes.jettwaveDark : themes.jettwaveLight}
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
