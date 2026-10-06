'use client';

import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { cx } from '@/styles';

import { footerStyles } from '../style';
import type { FormFooterProps } from '../type';

const FormFooter: FC<FormFooterProps> = ({ className, children, ...rest }) => {
  const styles = footerStyles;
  return (
    <Flexbox
      horizontal
      align={'center'}
      className={cx(styles.root, className)}
      gap={8}
      justify={'flex-end'}
      {...rest}
    >
      {children}
    </Flexbox>
  );
};

FormFooter.displayName = 'FormFooter';

export default FormFooter;
