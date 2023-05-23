import { Loading3QuartersOutlined as Loading } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useHighlight } from '@/hooks/useHighlight';

import { Prism } from './Prism';

import type { HighlighterProps } from './index';

const useStyles = createStyles(({ css, token, cx, prefixCls }) => {
  const prefix = `${prefixCls}-highlighter`;

  return {
    shiki: cx(
      `${prefix}-shiki`,
      css`
        .shiki {
          overflow-x: scroll;

          .line {
            font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
          }
        }
      `,
    ),
    prism: css`
      pre {
        overflow-x: scroll;
      }
    `,

    loading: css`
      position: absolute;
      top: 0;
      right: 0;
      color: ${token.colorTextTertiary};
      padding: 4px 8px;
      backdrop-filter: saturate(180%) blur(10px);
      border-radius: ${token.borderRadiusSM};
    `,
  };
});

type SyntaxHighlighterProps = Pick<HighlighterProps, 'language' | 'children' | 'theme'>;

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language, theme: appearance = 'light' }) => {
    const { styles, theme } = useStyles();
    const isDarkMode = appearance === 'dark';

    const [codeToHtml, isLoading] = useHighlight((s) => [s.codeToHtml, !s.highlighter], shallow);

    return (
      <>
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
