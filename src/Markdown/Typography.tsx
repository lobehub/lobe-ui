'use client';

import { FC } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './markdown.style';

export interface TypographyProps extends DivProps {
  fontSize?: number;
  headerMultiple?: number;
  lineHeight?: number;
  marginMultiple?: number;
}

const Typography: FC<TypographyProps> = ({
  children,
  className,
  fontSize,
  headerMultiple,
  marginMultiple,
  lineHeight,
  ...rest
}) => {
  const { cx, styles } = useStyles({ fontSize, headerMultiple, lineHeight, marginMultiple });

  return (
    <article className={cx(styles, className)} {...rest}>
      {children}
    </article>
  );
};

export default Typography;
