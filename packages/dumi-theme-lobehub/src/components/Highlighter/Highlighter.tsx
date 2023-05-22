import { useThemeMode } from 'antd-style';
import { memo, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { useStyles } from './Highlighter.style';

import type { HighlighterProps } from './index';
import { Prism } from './Prism';
import { useShiki } from './useShiki';

type SyntaxHighlighterProps = Pick<
  HighlighterProps,
  'language' | 'type' | 'children' | 'syntaxThemes'
>;

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language, type = 'shiki', syntaxThemes: syntaxTheme }) => {
    const { styles } = useStyles();
    const { isDarkMode } = useThemeMode();
    const [loading, setLoading] = useState(false);

    const codeToHtml = useShiki({ onLoadingChange: setLoading, theme: syntaxTheme?.shiki });

    switch (type) {
      case 'prism':
        return (
          <Flexbox className={styles.prism}>
            <Prism language={language}>{children}</Prism>
          </Flexbox>
        );
      default:
      case 'shiki':
        return (
          <>
            {loading ? (
              <Center horizontal gap={8} className={styles.loading}>
                Shiki Rendering...
              </Center>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: codeToHtml(children, language, isDarkMode) || '',
                }}
                className={styles.shiki}
              />
            )}
          </>
        );
    }
  },
);

export default SyntaxHighlighter;
