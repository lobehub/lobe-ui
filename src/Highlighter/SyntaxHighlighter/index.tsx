import { useHighlight } from '@/hooks/useHighlight';
import { Loading3QuartersOutlined as Loading } from '@ant-design/icons';
import { memo } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';
import type { HighlighterProps } from '../index';
import { Prism } from './Prism';
import { GlobalStyle } from './shikiTheme';
import { useStyles } from './style';

type SyntaxHighlighterProps = Pick<HighlighterProps, 'language' | 'children' | 'theme'>;

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language, theme: appearance = 'light' }) => {
    const { styles, theme } = useStyles();
    const isDarkMode = appearance === 'dark';

    const [codeToHtml, isLoading] = useHighlight((s) => [s.codeToHtml, !s.highlighter], shallow);

    return (
      <>
        <GlobalStyle />
        {isLoading ? (
          <div className={styles.prism}>
            <Prism language={language} isDarkMode={isDarkMode}>
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
