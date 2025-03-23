import { FC } from 'react';

import A from '@/A';
import { AProps } from '@/types';
import { CitationItem } from '@/types/citation';
import { safeParseJSON } from '@/utils/safeParseJSON';

import Citation from './Citation';

export interface LinkProps extends AProps {
  'aria-describedby'?: string;
  'citations'?: CitationItem[];
  'data-footnote-ref'?: boolean;
  'data-link'?: string;
  'id'?: string;
  'node'?: any;
}

const Link: FC<LinkProps> = ({ href, target, citations, ...rest }) => {
  // [^1] 格式类型
  if (rest['data-footnote-ref']) {
    return (
      <Citation citationDetail={safeParseJSON(rest['data-link'])} href={href} id={rest.id!} inSup>
        {rest.children}
      </Citation>
    );
  }

  // [1] 格式类型，搭配 citations 注入
  const match = href?.match(/citation-(\d+)/);

  if (match) {
    const index = Number.parseInt(match[1]) - 1;

    const detail = citations?.[index];

    return (
      <Citation citationDetail={detail} id={match[1]}>
        {match[1]}
      </Citation>
    );
  }

  const isNewWindow = href?.startsWith('http');

  return <A href={href} target={target || isNewWindow ? '_blank' : undefined} {...rest} />;
};

export default Link;
