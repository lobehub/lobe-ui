import { AnchorProps } from 'antd';
import { forwardRef } from 'react';

import A from '@/A';
import { AProps } from '@/types';

const Link = forwardRef<any, AProps & AnchorProps>(({ href, target, ...rest }, ref) => {
  const isNewWindoes = href?.startsWith('http');
  return (
    <A href={href} ref={ref} target={target || isNewWindoes ? '_blank' : undefined} {...rest} />
  );
});

export default Link;
