import { ReactNode } from 'react';

import Footnotes from '@/mdx/mdxComponents/Footnotes';

interface SectionProps {
  'children': ReactNode;
  'data-footnotes'?: boolean;
}

const Section = (props: SectionProps) => {
  // 说明是脚注
  if (props['data-footnotes']) {
    return <Footnotes {...props} />;
  }

  return <section {...props} />;
};

export default Section;
