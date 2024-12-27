'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { type DivProps } from '@/types';

export type FormFooterProps = DivProps;

const FormFooter = memo<FormFooterProps>(({ children, ...rest }) => {
  return (
    <Flexbox gap={8} horizontal justify={'flex-end'} {...rest}>
      {children}
    </Flexbox>
  );
});

export default FormFooter;
