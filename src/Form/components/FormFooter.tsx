'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';

import { footerStyles } from '../style';
import type { FormFooterProps } from '../type';

const FormFooter: FC<FormFooterProps> = ({ className, children, ...rest }) => {
  const styles = footerStyles;
  return (
    <Flexbox
      align={'center'}
      className={cx(styles.root, className)}
      gap={8}
      horizontal
      justify={'flex-end'}
      {...rest}
    >
      {children}
    </Flexbox>
  );
};

FormFooter.displayName = 'FormFooter';

export default FormFooter;
