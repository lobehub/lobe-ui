import { FC } from 'react';

import A from '@/A';
import { AProps } from '@/types';

import Citation from './Citation';

export interface LinkProps extends AProps {
  node: any;
}

const Link: FC<LinkProps> = ({ href, target, ...rest }) => {
  const match = href?.match(/citation-(\d+)/);

  if (match) {
    return <Citation id={match[1]}>{match[1]}</Citation>;
  }

  const isNewWindow = href?.startsWith('http');

  return <A href={href} target={target || isNewWindow ? '_blank' : undefined} {...rest} />;
};

export default Link;
