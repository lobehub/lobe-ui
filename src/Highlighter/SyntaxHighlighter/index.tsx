'use client';

import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';
import { useHighlight } from '@/hooks/useHighlight';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface SyntaxHighlighterProps extends DivProps {
  children: string;
  enableTransformer?: boolean;
  language: string;
}

const SyntaxHighlighter = memo<SyntaxHighlighterProps>(
  ({ children, language, className, style, enableTransformer }) => {
    const { styles, cx } = useStyles();
    const { data, isLoading } = useHighlight(children, language, enableTransformer);

    return (
      <>
        {isLoading || !data ? (
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
          <Flexbox
            align={'center'}
            className={styles.loading}
            gap={8}
            horizontal
            justify={'center'}
          >
            <Icon icon={Loader2} spin />
          </Flexbox>
        )}
      </>
    );
  },
);

export default SyntaxHighlighter;
