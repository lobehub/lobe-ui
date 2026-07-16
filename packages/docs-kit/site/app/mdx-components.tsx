import { Link } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, MouseEvent } from 'react';

import { Api } from '../components/Api/Api';
import { Demo } from '../components/Demo/Demo';
import { styles as docsLayoutStyles } from '../components/DocsLayout/style';
import { CodeBlock } from '../components/Mdx/CodeBlock';
import { springScrollToElement } from '../lib/scroller';

const createAnchoredHeading = (Tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
  function AnchoredHeading({ children, id, ...rest }: ComponentProps<'h2'>) {
    if (!id) return <Tag {...rest}>{children}</Tag>;

    const handleAnchorClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const heading = document.getElementById(id);
      if (heading) {
        springScrollToElement(heading, -100);
      }
    };

    return (
      <Tag id={id} {...rest}>
        {children}
        <a
          aria-label="Link to this section"
          className={docsLayoutStyles.headingAnchor}
          href={`#${id}`}
          onClick={handleAnchorClick}
        >
          <Link aria-hidden size={14} strokeWidth={1.8} />
        </a>
      </Tag>
    );
  };

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Api,
    Demo,
    h1: createAnchoredHeading('h2'),
    h2: createAnchoredHeading('h2'),
    h3: createAnchoredHeading('h3'),
    h4: createAnchoredHeading('h4'),
    pre: CodeBlock,
    ...components,
  };
}
