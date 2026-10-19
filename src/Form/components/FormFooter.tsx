'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { useFormClasses } from '../stableContext';
import { footerStyles } from '../style';
import type { FormFooterProps } from '../type';

const FormFooter: FC<FormFooterProps> = ({ className, children, style, ...rest }) => {
  const formClasses = useFormClasses();
  return (
    <Flexbox
      horizontal
      align={'center'}
      gap={8}
      justify={'flex-end'}
      {...rest}
      {...styleProps(footerStyles.root, clsx(formClasses('footer'), className), style)}
    >
      {children}
    </Flexbox>
  );
};

FormFooter.displayName = 'FormFooter';

export default FormFooter;
