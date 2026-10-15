'use client';

import { type FC } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { footerStyles } from '../style';
import type { FormFooterProps } from '../type';

const FormFooter: FC<FormFooterProps> = ({ className, children, style, ...rest }) => (
  <Flexbox
    horizontal
    align={'center'}
    gap={8}
    justify={'flex-end'}
    {...rest}
    {...styleProps(footerStyles.root, className, style)}
  >
    {children}
  </Flexbox>
);

FormFooter.displayName = 'FormFooter';

export default FormFooter;
