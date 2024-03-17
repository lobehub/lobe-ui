'use client';

import { CSSProperties, FC, PropsWithChildren } from 'react';

import { useStyles } from './markdown.style';

export interface TypographyProps extends PropsWithChildren {
  className?: string;
  fontSize?: number;
  headerMultiple?: number;
  lineHeight?: number;
  marginMultiple?: number;
  style?: CSSProperties;
}

export const Typography: FC<TypographyProps> = ({
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
    <article
      className={cx(
        styles.__root,
        styles.a,
        styles.blockquote,
        styles.code,
        styles.details,
        styles.header,
        styles.hr,
        styles.img,
        styles.kbd,
        styles.list,
        styles.p,
        styles.pre,
        styles.strong,
        styles.table,
        styles.video,
        className,
      )}
      {...rest}
    >
      {children}
    </article>
  );
};
