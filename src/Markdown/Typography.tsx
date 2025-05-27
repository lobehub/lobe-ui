'use client';

import { memo } from 'react';

import { useStyles } from './markdown.style';
import type { TypographyProps } from './type';

const Typography = memo<TypographyProps>(
  ({
    ref,
    children,
    className,
    fontSize,
    headerMultiple,
    marginMultiple = 2,
    lineHeight,
    ...rest
  }) => {
    const { cx, styles } = useStyles({ fontSize, headerMultiple, lineHeight, marginMultiple });
    return (
      <article className={cx(styles.root, styles.variant, className)} ref={ref} {...rest}>
        {children}
      </article>
    );
  },
);

Typography.displayName = 'Typography';

export default Typography;
