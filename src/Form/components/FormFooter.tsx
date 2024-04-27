import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { type DivProps } from '@/types';

export type FormFooterProps = DivProps;

const FormFooter = memo<FormFooterProps>(({ className, children, ...rest }) => {
  return (
    <Flexbox className={className} gap={8} justify={'flex-end'} {...rest} horizontal>
      {children}
    </Flexbox>
  );
});

export default FormFooter;
