'use client';

import type { FC, ReactNode } from 'react';

import Footnotes from '@/Markdown/components/Footnotes';

interface SectionProps {
  'children': ReactNode;
  'data-footnotes'?: boolean;
}

const Section: FC<SectionProps> = ({ children, ...rest }) => {
  // 说明是脚注
  if (rest['data-footnotes']) {
    return <Footnotes {...rest}>{children}</Footnotes>;
  }

  return <section {...rest}>{children}</section>;
};

Section.displayName = 'MdxSection';

export default Section;
