import { FC } from 'react';

import A from '@/A';
import { AProps } from '@/types';

export type LinkProps = AProps;

const Link: FC<LinkProps> = ({ href, target, ...rest }) => {
  const isNewWindow = href?.startsWith('http');
  return <A href={href} target={target || isNewWindow ? '_blank' : undefined} {...rest} />;
};

export default Link;
