import { useThemeMode } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { memo, useEffect } from 'react';
import { Center } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { useHighlight } from '@/hooks/useHighlight';
import { Icon } from '@/index';

import type { HighlighterProps } from '../index';
import { useStyles } from './style';

export type SyntaxHighlighterProps = Pick<HighlighterProps, 'language' | 'children' | 'theme'>;

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(({ children, language }) => {
  const { styles } = useStyles();
  const { isDarkMode } = useThemeMode();
  const [codeToHtml, isLoading] = useHighlight((s) => [s.codeToHtml, !s.highlighter], shallow);

  useEffect(() => {
    useHighlight.getState().initHighlighter();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className={styles.shiki}>
          <pre>
            <code>{children}</code>
          </pre>
        </div>
      ) : (
        <div
          className={styles.shiki}
          dangerouslySetInnerHTML={{
            __html: codeToHtml(children, language, isDarkMode) || '',
          }}
        />
      )}

      {isLoading && (
        <Center className={styles.loading} gap={8} horizontal>
          <Icon icon={Loader2} spin />
          Highlighting...
        </Center>
      )}
    </>
  );
});

export default SyntaxHighlighter;
