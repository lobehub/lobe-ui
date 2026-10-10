'use client';

import './style.css';

import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import type { TypographyProps } from './type';

export const TypographyImpl = ({
  ref,
  children,
  className,
  fontSize = 16,
  headerMultiple = 1,
  marginMultiple = 2,
  lineHeight = 1.8,
  borderRadius = 8,
  style,
  xstyle,
  ...rest
}: TypographyProps & { xstyle?: Parameters<typeof styleProps>[0] }) => {
  return (
    <article
      ref={ref}
      {...styleProps(xstyle, clsx('lobe-markdown', className), {
        '--lobe-markdown-border-radius': borderRadius,
        '--lobe-markdown-font-size': `${fontSize}px`,
        '--lobe-markdown-header-multiple': headerMultiple,
        '--lobe-markdown-line-height': lineHeight,
        '--lobe-markdown-margin-multiple': marginMultiple,
        ...style,
      } as CSSProperties)}
      {...rest}
    >
      {children}
    </article>
  );
};

const Typography = memo<TypographyProps>((props) => <TypographyImpl {...props} />);

Typography.displayName = 'Typography';

export default Typography;
