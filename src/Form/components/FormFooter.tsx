'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { useFooterStyles as useStyles } from '../style';
import type { FormFooterProps } from '../type';

const FormFooter = memo<FormFooterProps>(({ className, children, ...rest }) => {
  const { cx, styles } = useStyles();
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
});

FormFooter.displayName = 'FormFooter';

export default FormFooter;
