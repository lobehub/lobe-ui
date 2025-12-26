'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import { styles } from './markdown.style';
import type { TypographyProps } from './type';

const Typography = memo<TypographyProps>(
  ({
    ref,
    children,
    className,
    fontSize = 16,
    headerMultiple = 1,
    marginMultiple = 2,
    lineHeight = 1.8,
    borderRadius = 8,
    style,
    ...rest
  }) => {
    return (
      <article
        className={cx(styles.root, className)}
        ref={ref}
        style={{
          // @ts-ignore
          '--lobe-markdown-border-radius': borderRadius,
          '--lobe-markdown-font-size': `${fontSize}px`,
          '--lobe-markdown-header-multiple': headerMultiple,
          '--lobe-markdown-line-height': lineHeight,
          '--lobe-markdown-margin-multiple': marginMultiple,
          ...style,
        }}
        {...rest}
      >
        {children}
      </article>
    );
  },
);

Typography.displayName = 'Typography';

export default Typography;
