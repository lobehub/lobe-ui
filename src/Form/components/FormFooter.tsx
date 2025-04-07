'use client';

import { createStyles } from 'antd-style';
import { forwardRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import { type DivProps } from '@/types';

export type FormFooterProps = DivProps;

const useStyles = createStyles(({ css, token, responsive }) => {
  return {
    root: css`
      ${responsive.mobile} {
        padding: 16px;
        background: ${token.colorBgContainer};
        border-block-start: 1px solid ${token.colorBorderSecondary};
      }
    `,
  };
});

const FormFooter = forwardRef<HTMLDivElement, FormFooterProps>(
  ({ className, children, ...rest }, ref) => {
    const { cx, styles } = useStyles();
    return (
      <Flexbox
        align={'center'}
        className={cx(styles.root, className)}
        gap={8}
        horizontal
        justify={'flex-end'}
        ref={ref}
        {...rest}
      >
        {children}
      </Flexbox>
    );
  },
);

FormFooter.displayName = 'FormFooter';

export default FormFooter;
