'use client';

import { forwardRef } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './markdown.style';

export interface TypographyProps extends DivProps {
  fontSize?: number;
  headerMultiple?: number;
  lineHeight?: number;
  marginMultiple?: number;
}

const Typography = forwardRef<HTMLDivElement, TypographyProps>(
  ({ children, className, fontSize, headerMultiple, marginMultiple, lineHeight, ...rest }, ref) => {
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
