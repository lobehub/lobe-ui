import { useHighlight } from '@/hooks/useHighlight';
import { Loading3QuartersOutlined as Loading } from '@ant-design/icons';
import { memo, useEffect } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';
import type { HighlighterProps } from '../index';
import { Prism } from './Prism';

import { useThemeMode } from 'antd-style';
import { useStyles } from './style';

export type SyntaxHighlighterProps = Pick<HighlighterProps, 'language' | 'children' | 'theme'>;

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language, theme: appearance }) => {
    const { styles, theme } = useStyles();
    const { isDarkMode } = useThemeMode();
    const isDarkTheme = appearance ? appearance === 'dark' : isDarkMode;
    const [codeToHtml, isLoading] = useHighlight((s) => [s.codeToHtml, !s.highlighter], shallow);

    useEffect(() => {
      useHighlight.getState().initHighlighter();
    }, []);

    return (
      <>
        {isLoading ? (
          <div className={styles.prism}>
            <Prism language={language} isDarkMode={isDarkTheme}>
              {children}
            </Prism>
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: codeToHtml(children, language, isDarkMode) || '',
            }}
            className={styles.shiki}
          />
        )}

        {isLoading && (
          <Center horizontal gap={8} className={styles.loading}>
            <Loading spin style={{ color: theme.colorTextTertiary }} />
            shiki rendering...
          </Center>
        )}
      </>
    );
  },
);

export default SyntaxHighlighter;
