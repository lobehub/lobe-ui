import { useThemeMode } from 'antd-style';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import Icon from '@/Icon';
import { useHighlight } from '@/hooks/useHighlight';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface SyntaxHighlighterProps extends DivProps {
  children: string;
  language: string;
}

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language, className, style }) => {
    const { styles, cx } = useStyles();
    const { isDarkMode } = useThemeMode();

    const { data, isLoading } = useHighlight(children, language, isDarkMode);

    return (
      <>
        {isLoading ? (
          <div className={cx(styles.unshiki, className)} style={style}>
            <pre>
              <code>{children}</code>
            </pre>
          </div>
        ) : (
          <div
            className={cx(styles.shiki, className)}
            dangerouslySetInnerHTML={{
              __html: data as string,
            }}
            style={style}
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
  },
);

export default SyntaxHighlighter;
